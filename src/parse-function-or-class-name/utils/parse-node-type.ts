const typeStructures = [
  "Keyword",
  "Type",
  "Predicate",
  "Query",
];

export const parseNodeType = (nodeDataType: string) => {
  for (const typeStructure of typeStructures) {
    if (nodeDataType.endsWith(typeStructure)) {
      const regex = new RegExp(`TS(.*?)${typeStructure}`, "g");
      return nodeDataType
        .replace(regex, " $1")
        .trim()
        .toLowerCase();
    }
  }

  // For everyting else, we just remove the TS prefix and lowercase the first letter
  // e.g. TSTypeLiteral -> typeLiteral
  const result = nodeDataType.replace(/TS(.*?)/g, " $1").trim();
  return result.replace(/^.{1}/g, result[0].toLowerCase());
};
