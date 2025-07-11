import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as vscode from 'vscode';

export async function refactorSelectionHandler() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('No active editor found.');
    return;
  }

  const selection = editor.selection;
  if (selection.isEmpty) {
    vscode.window.showInformationMessage('No text selected to sanitize.');
    return;
  }

  const selectedText = editor.document.getText(selection);

  try {
    const ast = parse(`<>${selectedText}</>`, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    let attributesChanged = 0;
    const visitor = {
      JSXAttribute(path: any) {
        if (t.isJSXIdentifier(path.node.name)) {
          const attributeName = path.node.name.name;
          if (attributeName.includes('-')) {
            const newName = attributeName.replace(
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
      const fragmentBody = (ast.program.body[0] as any).expression.children;
      const newCode = fragmentBody
        .map((node: any) => generate(node).code)
        .join('\n');

      editor.edit((editBuilder) => {
        editBuilder.replace(selection, newCode);
      });
      vscode.window.showInformationMessage(
        `Successfully sanitized ${attributesChanged} attribute(s).`
      );
    } else {
      vscode.window.showInformationMessage(
        'No attributes needed fixing in the selection.'
      );
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    vscode.window.showErrorMessage(
      `Failed to sanitize selection: ${errorMessage}`
    );
    console.error(e);
  }
}
