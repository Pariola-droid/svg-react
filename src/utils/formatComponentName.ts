/**
 * Formats a filename into a valid React component name in PascalCase.
 * @param originalName The base name of the file (e.g., 'icon-find').
 * @param prefix A prefix to add to the name (e.g., 'Icon').
 * @returns The formatted component name (e.g., 'IconIconFind').
 */

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
