import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getWebviewContent } from '../helpers/getWebviewContent';
import { jsxToSvgString } from '../utils';

export async function previewSvgComponentHandler(uri: vscode.Uri) {
  if (!uri) {
    vscode.window.showErrorMessage('No component file selected.');
    return;
  }

  try {
    const fileContent = await fs.readFile(uri.fsPath, 'utf-8');
    const ast = parse(fileContent, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    let svgNode: t.JSXElement | null = null;

    // stop after spotting 1st <svg>
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
        'svgComponentPreview',
        `Preview: ${path.basename(uri.fsPath)}`,
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
      panel.webview.html = getWebviewContent(svgString);
    } else {
      vscode.window.showInformationMessage(
        'No SVG element found in this component.'
      );
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    vscode.window.showErrorMessage(
      `Failed to preview component: ${errorMessage}`
    );
  }
}
