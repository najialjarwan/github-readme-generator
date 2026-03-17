export const formatProjectObject = (project) => {
  const lines = [];

  for (const [key, value] of Object.entries(project)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: [],`);
      } else {
        const arr = value
          .map((v) =>
            key === "techStack" && typeof v === "string" && v.startsWith("TECHS_BY_TECH.")
              ? v
              : `'${v}'`
          )
          .join(", ");
        lines.push(`${key}: [${arr}],`);
      }
    } else if (typeof value === "string") {
      lines.push(`${key}: '${value}',`);
    } else {
      lines.push(`${key}: ${value},`);
    }
  }

  return `\n  {\n    ${lines.join("\n    ")}\n  },`;
};