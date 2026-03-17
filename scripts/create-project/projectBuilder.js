export const buildProjectObject = (answers) => {
  const {
    name,
    displayName,
    title,
    type,
    role,
    platform,
    status,
    version,
    rank,
    duration,
    liveLink,
    gitLink,
    description,
    motivation,
    thumbnail,
    techStack,
    keyFeatures,
    futureImprovements,
    credits,
    notes,
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
    ...(version && { version }),
    ...(rank && { rank }),
    ...(duration && { duration }),
    ...(liveLink && { liveLink }),
    ...(gitLink && { gitLink }),
    ...(description && { description }),
    ...(motivation && { motivation }),
    ...(thumbnail && { thumbnail }),
    ...(techStack?.length && {
      techStack: techStack.map((tech) =>
        tech.startsWith("TECHS_BY_TECH.") ? tech : `TECHS_BY_TECH.${tech}`
      ),
    }),
    ...(keyFeatures?.length && { keyFeatures }),
    ...(futureImprovements?.length && { futureImprovements }),
    ...(credits?.length && { credits }),
    ...(notes?.length && { notes }),
    ...(tags?.length && { tags }),
  };

  return project;
};