import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { promises as fs } from 'fs';
import * as vscode from 'vscode';

/**
 * Refactors a component file by converting kebab-case SVG attributes to camelCase.
 * @param uri The URI of the component file to refactor.
 * @returns 1 if the file was changed, 0 otherwise.
 */

export async function refactorFile(uri: vscode.Uri): Promise<number> {
  const fileContent = await fs.readFile(uri.fsPath, 'utf-8');
  const ast = parse(fileContent, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  let attributesChanged = 0;

  const visitor = {
    JSXAttribute(path: any) {
      if (t.isJSXIdentifier(path.node.name)) {
        const attributeName = path.node.name.name;
        if (attributeName.includes('-')) {
          const newName: string = attributeName.replace(
            /-(\w)/g,
            (_: string, letter: string) => letter.toUpperCase()
          );
          path.node.name.name = newName;
          attributesChanged++;
        }
      }
    },
  };

  traverse(ast, visitor);

  if (attributesChanged > 0) {
    const { code } = generate(ast, { retainLines: true });
    await fs.writeFile(uri.fsPath, code);
    return 1;
  }

  return 0;
}
