import * as vscode from 'vscode';
import { getWebviewContent } from '../helpers/getWebviewContent';
import { extractAndCleanSvg } from '../utils';

export async function previewSelectionHandler() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.selection.isEmpty) {
    vscode.window.showInformationMessage('No SVG code selected to preview.');
    return;
  }

  const selectedText = editor.document.getText(editor.selection);
  const svgString = extractAndCleanSvg(selectedText);

  if (svgString) {
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
}
