import fs from "fs";
import { PROJECTS } from "../../my-portfolio/src/data/readmeExports.js";

const template = fs.readFileSync(
  "./templates/readme.template.md",
  "utf8"
);

if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
}

function formatStack(stack) {
  return stack.map(s => `- ${s.name || s}`).join("\n");
}

function formatFeatures(details) {
  if (!details) return "- Feature information not provided";
  return details.map(d => `- ${d}`).join("\n");
}

PROJECTS.forEach(project => {
  let readme = template;

  readme = readme.replace(/{{title}}/g, project.title);
  readme = readme.replace(/{{description}}/g, project.description);
  readme = readme.replace(/{{type}}/g, project.type || "");
  readme = readme.replace(/{{role}}/g, project.role || "");
  readme = readme.replace(/{{platform}}/g, project.platform || "");
  readme = readme.replace(/{{duration}}/g, project.duration || "");

  readme = readme.replace(/{{stack}}/g, formatStack(project.stack || []));
  readme = readme.replace(/{{features}}/g, formatFeatures(project.details));

  readme = readme.replace(/{{gitLink}}/g, project.gitLink || "");
  readme = readme.replace(/{{liveLink}}/g, project.liveLink || "");

  const outputPath = `./output/${project.name}-README.md`;

  fs.writeFileSync(outputPath, readme);

  console.log(`Generated README for ${project.name}`);
});