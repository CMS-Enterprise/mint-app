const properlyCapitalizeInitiator = (fullName: string) => {
  const [namePart, parenthesisPart] = fullName.split(' (');

  const capitalizedName = namePart
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());

  return parenthesisPart
    ? `${capitalizedName} (${parenthesisPart}`
    : capitalizedName;
};

export default properlyCapitalizeInitiator;
