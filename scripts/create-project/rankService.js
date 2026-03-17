export const shiftRanks = (desiredRank, fileContent) =>
  fileContent.replace(/rank:\s*(\d+)/g, (match, rankValue) => {
    const rank = parseInt(rankValue);

    if (rank >= desiredRank) {
      return `rank: ${rank + 1}`;
    }

    return match;
  });