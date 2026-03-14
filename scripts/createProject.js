import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

import { PROJECTS } from "../../my-portfolio/src/data/readmeExports.js";
import { generateReadmeForProject } from "./generate-readmes.js";

/* -------------------------------------------------- */
/* Paths & Environment Setup */
/* -------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.resolve(
  __dirname,
  "../../my-portfolio/src/data/projects/projects.js"
);

const PROJECTS_ROOT = path.resolve(__dirname, "../..");

/* -------------------------------------------------- */
/* Readline Setup */
/* -------------------------------------------------- */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

/* -------------------------------------------------- */
/* Utility Helpers */
/* -------------------------------------------------- */

const parseCommaList = (input) =>
  input
    ? input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const safeReadFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`❌ Failed to read file: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }
};

const safeWriteFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, "utf8");
  } catch (error) {
    console.error(`❌ Failed to write file: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }
};

/* -------------------------------------------------- */
/* Rank Management */
/* -------------------------------------------------- */

const shiftRanks = (desiredRank, fileContent) =>
  fileContent.replace(/rank:\s*(\d+)/g, (match, rankValue) => {
    const rank = parseInt(rankValue);

    if (rank >= desiredRank) {
      return `rank: ${rank + 1}`;
    }

    return match;
  });

/* -------------------------------------------------- */
/* Project Object Formatting */
/* -------------------------------------------------- */

const formatProjectObject = (project) => {
  const lines = Object.entries(project).map(([key, value]) => {
    if (Array.isArray(value)) {
      if (!value.length) return `${key}: [],`;

      const arr = value.map((v) => `'${v}'`).join(", ");
      return `${key}: [${arr}],`;
    }

    if (typeof value === "string") {
      return `${key}: '${value}',`;
    }

    return `${key}: ${value},`;
  });

  return `\n  {\n    ${lines.join("\n    ")}\n  },`;
};

/* -------------------------------------------------- */
/* File Updates */
/* -------------------------------------------------- */

const insertProjectIntoFile = (project, desiredRank) => {
  let content = safeReadFile(PROJECTS_FILE);

  if (project.name !== "portfolio") {
    content = shiftRanks(desiredRank, content);
  }

  const insertionIndex = content.lastIndexOf("]");

  if (insertionIndex === -1) {
    console.error("❌ Could not locate PROJECTS array closing bracket.");
    process.exit(1);
  }

  const projectString = formatProjectObject(project);

  const updated =
    content.slice(0, insertionIndex) +
    projectString +
    "\n" +
    content.slice(insertionIndex);

  safeWriteFile(PROJECTS_FILE, updated);
};

/* -------------------------------------------------- */
/* README Generation */
/* -------------------------------------------------- */

const createProjectReadme = (project) => {
  const projectFolder = path.join(PROJECTS_ROOT, project.name);

  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder, { recursive: true });
  }

  generateReadmeForProject(project, projectFolder);
};

/* -------------------------------------------------- */
/* Project Builder */
/* -------------------------------------------------- */

const buildProjectObject = (answers, desiredRank) => {
  const {
    name,
    title,
    type,
    role,
    platform,
    img,
    duration,
    liveLink,
    gitLink,
    description,
    keyFeatures,
    challenges,
    futureImprovements,
    tags,
    status,
    version,
  } = answers;

  const project = {
    name,
    title,
    ...(type && { type }),
    ...(role && { role }),
    ...(platform && { platform }),
    ...(img && { img }),
    screenshots: [],
    techStack: [],
    ...(duration && { duration }),
    ...(liveLink && { liveLink }),
    ...(gitLink && { gitLink }),
    ...(description && { description }),
    ...(keyFeatures.length && { keyFeatures }),
    ...(challenges.length && { challenges }),
    ...(futureImprovements.length && { futureImprovements }),
    ...(tags.length && { tags }),
    ...(status && { status }),
    ...(version && { version }),
  };

  if (name !== "portfolio") {
    project.rank = desiredRank;
  }

  return project;
};

/* -------------------------------------------------- */
/* CLI Prompt Flow */
/* -------------------------------------------------- */

const promptProjectData = async () => {
  console.log("\n=== Create New Project ===\n");

  const answers = {
    name: await ask("Project name (unique, lowercase, no spaces): "),
    title: await ask("Title: "),
    type: await ask("Type (optional): "),
    role: await ask("Role (optional): "),
    platform: await ask("Platform (optional): "),
    img: await ask("Image path (optional): "),
    duration: await ask("Development period (optional): "),
    liveLink: await ask("Live link (optional): "),
    gitLink: await ask("GitHub link (optional): "),
    description: await ask("Description (optional): "),
    keyFeatures: parseCommaList(await ask("Key features (comma separated): ")),
    challenges: parseCommaList(await ask("Challenges (comma separated): ")),
    futureImprovements: parseCommaList(
      await ask("Future improvements (comma separated): ")
    ),
    tags: parseCommaList(await ask("Tags (comma separated): ")),
    status: await ask("Status (planned/active/completed): "),
    version: await ask("Version: "),
  };

  const desiredRankInput = await ask("Desired rank (optional): ");
  const desiredRank = desiredRankInput
    ? parseInt(desiredRankInput)
    : PROJECTS.length + 1;

  return { answers, desiredRank };
};

/* -------------------------------------------------- */
/* Main */
/* -------------------------------------------------- */

const main = async () => {
  try {
    const { answers, desiredRank } = await promptProjectData();

    const project = buildProjectObject(answers, desiredRank);

    console.log("\n=== Preview ===");
    console.log(JSON.stringify(project, null, 2));

    const confirm = await ask("\nRender this project into projects.js? (y/n): ");

    if (confirm.toLowerCase() !== "y") {
      console.log("⚠️ Aborted. Project not added.");
      rl.close();
      return;
    }

    insertProjectIntoFile(project, desiredRank);

    console.log(`✅ Project "${project.name}" added to projects.js`);

    createProjectReadme(project);

    console.log(`✅ README generated for "${project.name}"`);

    rl.close();
  } catch (error) {
    console.error("❌ Unexpected error:");
    console.error(error);
    rl.close();
    process.exit(1);
  }
};

main();