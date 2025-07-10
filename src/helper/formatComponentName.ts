export function formatComponentName(
  originalName: string,
  prefix: string
): string {
  const pascalCaseName = originalName
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter((word) => !!word)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `${prefix}${pascalCaseName}`;
}
