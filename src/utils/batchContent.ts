export const getBatchText = (batchContent: Record<string, string>): string => {
  const keys = Object.keys(batchContent).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );

  const chunks = keys
    .map((key) => batchContent[key]?.trim())
    .filter((value): value is string => Boolean(value));

  return chunks.join("\n\n");
};
