import readline from "readline";
import { PROJECTS } from "../../../my-portfolio/src/data/readmeExports.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const parseCommaList = (input) => {
  if (!input) return [];

  // ✅ Already an array → return as-is
  if (Array.isArray(input)) return input;

  // ✅ String → split
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const askMultiline = (prompt) => {
  return new Promise((resolve) => {
    console.log(prompt);
    console.log("(Press ENTER on empty line to finish)\n");

    const lines = [];

    const onLine = (input) => {
      if (!input.trim()) {
        rl.removeListener("line", onLine);
        resolve(lines);
      } else {
        lines.push(input.trim());
      }
    };

    rl.on("line", onLine);
  });
};

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
    const type = await ask("- Type (university/personal project etc...): ");

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

    const version = await ask("- Version (string - ex: 1.0.0): ");

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

    const motivation = await ask("- Motivation (short paragraph): ");

    const thumbnail = await ask("- Thumbnail (path to image): ");

    const techStack = parseCommaList(
      await ask("- Tech Stack (tech names separated by comma - ex: html,css,php): ")
    );

    const keyFeatures = await askMultiline("- Key Features: ");

    const futureImprovements = await askMultiline("- Future Improvements: ");

    const credits = await askMultiline("- Credits: ");

    const notes = await askMultiline("- Notes: ");

    const tags = parseCommaList(await ask("- Tags (comma separated - ex: fitness,web-app): "));

    const project = {
      name,
      ...(displayName && displayName !== name && { displayName }),
      ...(title && { title }),
      ...(type && { type }),
      ...(role && { role }),
      ...(platform && { platform }),
      ...(status && { status }),
      ...(version && { version }),
      rank: rankInput,
      ...(duration && { duration }),
      ...(liveLink && { liveLink }),
      ...(gitLink && { gitLink }),
      ...(description && { description }),
      ...(motivation && { motivation }),
      ...(thumbnail && { thumbnail }),
      screenshots: [],
      ...(techStack.length && { techStack }),
      ...(keyFeatures.length && { keyFeatures }),
      ...(futureImprovements.length && { futureImprovements }),
      ...(credits.length && { credits }),
      ...(notes.length && { notes }),
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