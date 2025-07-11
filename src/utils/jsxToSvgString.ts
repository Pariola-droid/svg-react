import * as t from '@babel/types';

/**
 * Recursively builds a valid SVG string from a JSX AST node.
 * This handles nested elements and attribute conversion.
 * @param node The Babel AST node for a JSXElement.
 * @returns A string of valid SVG markup.
 */

export function jsxToSvgString(node: t.JSXElement): string {
  // ['svg', 'path]
  const tagName = (node.openingElement.name as t.JSXIdentifier).name;
  let attrs = '';

  // JSX attributes -> SVG attributes: [strokeWidth -> stroke-width]
  node.openingElement.attributes.forEach((attr) => {
    if (t.isJSXAttribute(attr)) {
      const name = attr.name.name as string;

      const svgAttrName = name.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`
      );

      let value = '';
      if (t.isStringLiteral(attr.value)) {
        value = attr.value.value;
      } else if (t.isJSXExpressionContainer(attr.value)) {
        const expr = attr.value.expression;
        if (t.isStringLiteral(expr) || t.isNumericLiteral(expr)) {
          value = String(expr.value);
        }
      }
      attrs += ` ${svgAttrName}="${value}"`;
    }
  });

  const children = node.children
    .map((child) => {
      if (t.isJSXElement(child)) {
        return jsxToSvgString(child);
      }
      if (t.isJSXText(child)) {
        return child.value.trim();
      }
      return '';
    })
    .join('');

  return `<${tagName}${attrs}>${children}</${tagName}>`;
}
