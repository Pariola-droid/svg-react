import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getWebviewContent } from '../helpers/getWebviewContent';

export async function previewHandler(uri: vscode.Uri) {
  if (!uri && vscode.window.activeTextEditor) {
    uri = vscode.window.activeTextEditor.document.uri;
  }
  if (!uri) {
    vscode.window.showErrorMessage(
      'No SVG file selected or active to preview.'
    );
    return;
  }

  const panel = vscode.window.createWebviewPanel(
    'svgPreview',
    `Preview: ${path.basename(uri.fsPath)}`,
    vscode.ViewColumn.One,
    {}
  );

  try {
    const svgContent = await fs.readFile(uri.fsPath, 'utf-8');
    panel.webview.html = getWebviewContent(svgContent);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    panel.webview.html = `<h1>Error reading SVG file: ${errorMessage}</h1>`;
  }
}
