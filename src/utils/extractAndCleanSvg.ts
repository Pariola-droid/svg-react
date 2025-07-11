const regex = {
  findSvgBlock: /<svg[^>]*>[\s\S]*?<\/svg>/,
  findCamelCase: /([a-zA-Z])([A-Z])/g,
  findJsxExpressions: /(\w+)={([^}]+)}/g,
};

/**
 * Takes a string of JSX/TSX code and extracts and cleans the first SVG block it finds.
 * @param sourceText The source code of a component or a selection.
 * @returns A valid SVG string ready for preview, or null if no SVG is found.
 */

export function extractAndCleanSvg(sourceText: string): string | null {
  const svgMatch = sourceText.match(regex.findSvgBlock);
  if (!svgMatch) {
    return null;
  }
  let svgString = svgMatch[0];

  svgString = svgString.replace(regex.findCamelCase, (match, p1, p2) => {
    return `${p1}-${p2.toLowerCase()}`;
  });

  svgString = svgString.replace(
    regex.findJsxExpressions,
    (match, attrName, value) => {
      if (value.includes('currentColor')) {
        return `${attrName}="white"`;
      }

      const literalMatch =
        value.match(/^['"]([^'"]+)['"]$/) || value.match(/^\d+\.?\d*$/);
      if (literalMatch) {
        return `${attrName}="${literalMatch[1] || literalMatch[0]}"`;
      }

      return '';
    }
  );

  return svgString;
}
