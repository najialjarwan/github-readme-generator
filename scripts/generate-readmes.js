import fs from "fs";
import path from "path";
import { PROJECTS } from "../../my-portfolio/src/data/readmeExports.js";
import { TECHS_BY_TECH } from "../../my-portfolio/src/data/readmeExports.js";

const templatePath = path.resolve("./templates/readme.template.md");
const template = fs.readFileSync(templatePath, "utf8");

/**
 * Format arrays into markdown list, returns null if empty
 * @param {string[]} arr
 * @returns {string|null}
 */
function formatList(arr) {
    return arr?.length ? arr.map(i => `- ${i}`).join("\n") : null;
}


function renderTechStack(techStack) {
    return techStack
        .map((tech) => {
            const icon = tech.tool || tech.tech;
            return `<img src="https://najialjarwan.vercel.app/external-icons/${icon}.svg" height="40" title="${tech.name}" />`;
        })
        .join('\n');
}


/**
 * Optional section replacer:
 * If content is falsy, remove the whole section including header
 * Otherwise include heading and content
 * @param {string} readme
 * @param {string} sectionName
 * @param {string|null} content
 * @param {string} heading
 * @returns {string}
 */
function optionalSection(readme, sectionName, content, heading) {
    const regex = new RegExp(`{{#${sectionName}}}[\\s\\S]*?{{/${sectionName}}}`, "g");
    if (!content) return readme.replace(regex, ""); // remove entire block
    return readme.replace(regex, `## ${heading}\n\n${content}`); // render with heading
}

/**
 * Render single placeholders (non-section)
 */
function renderPlaceholder(readme, placeholder, value) {
    if (!value) return readme.replace(new RegExp(`{{${placeholder}}}`, "g"), "");
    const transformed = value.charAt(0).toUpperCase() + value.slice(1);
    return readme.replace(new RegExp(`{{${placeholder}}}`, "g"), transformed);
}
/**
 * Generate Project Overview as an HTML table or Markdown table
 * Always render; only include non-empty properties
 */
function formatProjectOverview(project) {
    const rows = [];
    const overviewProps = [
        ["Type", project.type],
        ["My Role", project.role],
        ["Platform", project.platform],
        ["Duration", project.duration],
        ["Status", project.status],
        ["Version", project.version],
        ["Live Demo", project.liveLink ? project.liveLink : "No public live deployment available"]
    ];

    overviewProps.forEach(([label, value]) => {
        if (value) {
            // Markdown table row
            rows.push(`| ${label} | ${value} |`);
        }
    });

    const htmlRows = overviewProps
        .filter(([_, value]) => value)
        .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
        .join("\n");
    return `<table align="center">\n${htmlRows}\n</table>`;
}

/**
 * Generate README for a single project
 * @param {object} project
 * @param {string} outputPath
 */
export function generateReadmeForProject(project, outputPath) {
    let readme = template;

    // --- Single value placeholders ---
    const placeholders = {
        name: project.displayName ?? project.name,
        title: (project.title ?? "Untitled Project")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        description: project.description ?? "No description provided.",
    };

    for (const [key, value] of Object.entries(placeholders)) {
        readme = renderPlaceholder(readme, key, value);
    }

    const resolvedTechStack = project.techStack?.map((tech) => {
        if (typeof tech === "string") {
            const key = tech.replace("TECHS_BY_TECH.", "");
            return TECHS_BY_TECH[key];
        }
        return tech;
    });

    // --- Optional sections ---
    readme = renderPlaceholder(
        readme,
        "techStack",
        renderTechStack(resolvedTechStack)
    );
    readme = renderPlaceholder(readme, "projectOverview", formatProjectOverview(project));
    readme = optionalSection(
        readme,
        "motivationSection",
        project.motivation,
        "💡 Problem / Motivation"
    );
    readme = optionalSection(
        readme,
        "featuresSection",
        formatList(project.keyFeatures),
        "✨ Key Features"
    );
    readme = optionalSection(
        readme,
        "futureImprovementsSection",
        formatList(project.futureImprovements),
        "🚀 Future Improvements"
    );
    readme = optionalSection(
        readme,
        "creditsSection",
        formatList(project.credits),
        "🎨 Credits & Inspirations"
    );
    readme = optionalSection(
        readme,
        "noteSection",
        formatList(project.notes),
        "📝 Notes"
    );

    // --- Determine final path ---
    let finalPath;
    if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        finalPath = stats.isDirectory()
            ? path.join(outputPath, "README.md")
            : outputPath;
    } else {
        finalPath = outputPath;
    }

    fs.writeFileSync(finalPath, readme, "utf8");
    console.log(`✅ Generated README for ${project.name} at ${finalPath}`);
}

/**
 * Generate all READMEs in a directory
 * @param {string} outputDir
 */
export function generateAllReadmes(outputDir = "./output") {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    PROJECTS.forEach(project => {
        const outputPath = path.join(outputDir, `${project.name}-README.md`);
        generateReadmeForProject(project, outputPath);
    });
}

// Auto-run if executed directly
if (process.argv[1].includes("generate-readmes.js")) {
    generateAllReadmes();
}