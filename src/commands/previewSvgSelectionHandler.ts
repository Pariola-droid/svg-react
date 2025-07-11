import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as vscode from 'vscode';
import { getWebviewContent } from '../helpers/getWebviewContent';
import { jsxToSvgString } from '../utils';

export async function previewSvgSelectionHandler() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.selection.isEmpty) {
    vscode.window.showInformationMessage('No SVG code selected to preview.');
    return;
  }

  const selectedText = editor.document.getText(editor.selection);

  try {
    const ast = parse(`<>${selectedText}</>`, {
      sourceType: 'module',
      plugins: ['jsx'],
    });
    let svgNode: t.JSXElement | null = null;

    traverse(ast, {
      JSXElement(path) {
        if (t.isJSXIdentifier(path.node.openingElement.name, { name: 'svg' })) {
          svgNode = path.node;
          path.stop();
        }
      },
    });

    if (svgNode) {
      const svgString = jsxToSvgString(svgNode);
      const panel = vscode.window.createWebviewPanel(
        'svgSelectionPreview',
        'Preview: Selection',
        vscode.ViewColumn.Beside,
        {}
      );
      panel.webview.html = getWebviewContent(svgString);
    } else {
      vscode.window.showInformationMessage(
        'No valid SVG element found in the selection.'
      );
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    vscode.window.showErrorMessage(
      `Failed to parse selection: ${errorMessage}`
    );
  }
}
