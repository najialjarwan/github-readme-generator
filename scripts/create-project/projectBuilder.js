export const buildProjectObject = (answers) => {
  const {
    name,
    displayName,
    title,
    type,
    role,
    platform,
    status,
    rank,
    duration,
    liveLink,
    gitLink,
    description,
    thumbnail,
    screenshots,
    techStack,
    keyFeatures,
    challenges,
    futureImprovements,
    tags,
  } = answers;

  const project = {
    name,
    ...(displayName && { displayName }),
    ...(title && { title }),
    ...(type && { type }),
    ...(role && { role }),
    ...(platform && { platform }),
    ...(status && { status }),
    ...(rank && { rank }),
    ...(duration && { duration }),
    ...(liveLink && { liveLink }),
    ...(gitLink && { gitLink }),
    ...(description && { description }),
    ...(thumbnail && { thumbnail }),
    screenshots: screenshots || [],
    ...(techStack?.length && {
      techStack: techStack.map((tech) =>
        tech.startsWith("TECHS_BY_TECH.") ? tech : `TECHS_BY_TECH.${tech}`
      ),
    }),
    ...(keyFeatures?.length && { keyFeatures }),
    ...(challenges?.length && { challenges }),
    ...(futureImprovements?.length && { futureImprovements }),
    ...(tags?.length && { tags }),
  };

  return project;
};