import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

import { promptProjectData } from "./create-project/prompts.js";
import { buildProjectObject } from "./create-project/projectBuilder.js";
import { formatProjectObject } from "./create-project/formatter.js";
import { shiftRanks } from "./create-project/rankService.js";
import { generateReadmeForProject } from "./generate-readmes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.resolve(
  __dirname,
  "../../my-portfolio/src/data/projects/projects.js"
);

const PROJECTS_ROOT = path.resolve(__dirname, "../..");

// Helper for final confirmation
const askConfirmation = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });

const main = async () => {
  try {
    // Prompt all project data
    const answers = await promptProjectData();
    const project = buildProjectObject(answers);

    // Show preview exactly like projects.js
    console.log("\n=== Preview ===");
    console.log(formatProjectObject(project));

    // Ask for confirmation
    const confirm = await askConfirmation("\nRender this project into projects.js? (y/n): ");
    if (!confirm) {
      console.log("⚠️ Aborted. Project not added.");
      process.exit(0);
    }

    // Update projects.js
    let content = fs.readFileSync(PROJECTS_FILE, "utf8");
    if (project.name !== "portfolio" && project.rank) {
      content = shiftRanks(project.rank, content);
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

    fs.writeFileSync(PROJECTS_FILE, updated, "utf8");
    console.log(`✅ Project "${project.name}" added to projects.js`);

    // Ensure project folder exists
    const projectFolder = path.join(PROJECTS_ROOT, project.name);
    if (!fs.existsSync(projectFolder)) fs.mkdirSync(projectFolder, { recursive: true });

    // Generate README
    generateReadmeForProject(project, projectFolder);
    console.log(`✅ README generated for "${project.name}"`);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
};

main();