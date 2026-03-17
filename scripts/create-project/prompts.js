import readline from "readline";
import { PROJECTS } from "../../../my-portfolio/src/data/readmeExports.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const parseCommaList = (input) =>
  input ? input.split(",").map((s) => s.trim()).filter(Boolean) : [];

/* ---------------- Validators ---------------- */

const validateName = (name) => {
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error(
      "Name must be lowercase, no spaces, kebab-case (ex: project-x)"
    );
  }
  if (PROJECTS.some((p) => p.name === name)) {
    throw new Error("Name already exists. Must be unique.");
  }
};

const validateEnum = (value, allowed, field) => {
  if (!value) return;
  if (!allowed.includes(value)) {
    throw new Error(`${field} must be one of: ${allowed.join(", ")}`);
  }
};

const validateRank = (rank) => {
  const num = parseInt(rank);
  if (isNaN(num) || num <= 0) {
    throw new Error("Rank must be a positive integer.");
  }
  return num;
};

const validateURL = (url) => {
  if (!url) return;
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL format.");
  }
};

/* ---------------- Prompt Flow ---------------- */

export const promptProjectData = async () => {
  try {
    console.log("\n=== Create New Project ===\n");

    let name;
    while (!name) {
      try {
        const input = await ask("- Name (string - lowercase - no spaces - kebab-case): ");
        validateName(input);
        name = input;
      } catch (err) {
        console.error(err.message);
      }
    }

    const displayName = await ask(
      "- Display Name (string - skip if same as name): "
    );
    
    const title = await ask("- Title (string): ");
    const type = await ask("- Type (university/personal etc...): ");
    
    let role;
    while (!role) {
      try {
        const input = await ask("- Role (front-end/back-end/full-stack): ");
        validateEnum(input, ["front-end", "back-end", "full-stack"], "Role");
        role = input;
      } catch (err) {
        console.error(err.message);
      }
    }

    const platform = await ask("- Platform (website/desktop/pwa etc...): ");

    const techStack = parseCommaList(
      await ask("- Tech Stack (tech names separated by comma - ex: html,css,php): ")
    );

    const duration = await ask("- Duration (string - ex: mar 15 - may 15): ");

    let liveLink;
    while (true) {
      try {
        const input = await ask("- Live Link (string): ");
        validateURL(input);
        liveLink = input || undefined;
        break;
      } catch (err) {
        console.error(err.message);
      }
    }

    let gitLink;
    while (true) {
      try {
        const input = await ask("- Git Link (repository URL): ");
        validateURL(input);
        gitLink = input || undefined;
        break;
      } catch (err) {
        console.error(err.message);
      }
    }

    const description = await ask("- Description (one short sentence): ");
    const thumbnail = await ask("- Thumbnail (path to image): ");
    const keyFeatures = parseCommaList(await ask("- Key Features (comma separated): "));
    const challenges = parseCommaList(await ask("- Challenges (comma separated): "));
    const futureImprovements = parseCommaList(await ask("- Future Improvements (comma separated): "));
    const tags = parseCommaList(await ask("- Tags (comma separated - ex: fitness,web-app): "));

    let rankInput;
    while (true) {
      try {
        const input = await ask("- Rank (positive integer - above 0): ");
        rankInput = validateRank(input);
        break;
      } catch (err) {
        console.error(err.message);
      }
    }

    let status;
    while (!status) {
      try {
        const input = await ask("- Status (completed/archived/active): ");
        validateEnum(input, ["completed", "archived", "active"], "Status");
        status = input;
      } catch (err) {
        console.error(err.message);
      }
    }

    const project = {
      name,
      ...(displayName && displayName !== name && { displayName }),
      ...(title && { title }),
      ...(type && { type }),
      ...(role && { role }),
      ...(platform && { platform }),
      ...(status && { status }),
      rank: rankInput,
      ...(duration && { duration }),
      ...(liveLink && { liveLink }),
      ...(gitLink && { gitLink }),
      ...(description && { description }),
      ...(thumbnail && { thumbnail }),
      screenshots: [],
      ...(techStack.length && { techStack }),
      ...(keyFeatures.length && { keyFeatures }),
      ...(challenges.length && { challenges }),
      ...(futureImprovements.length && { futureImprovements }),
      ...(tags.length && { tags }),
    };

    rl.close();
    return project;
  } catch (err) {
    rl.close();
    console.error("\n❌ Input error:", err.message);
    process.exit(1);
  }
};