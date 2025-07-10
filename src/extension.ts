import { transform } from '@svgr/core';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'svgreact.convertFile',
    async (uri: vscode.Uri) => {
      if (!uri) {
        const files = await vscode.window.showOpenDialog({
          canSelectMany: false,
          openLabel: 'Select SVG to Convert',
          filters: {
            'SVG files': ['svg'],
          },
        });

        if (files && files.length > 0) {
          uri = files[0];
        }
      }

      if (!uri) {
        vscode.window.showErrorMessage('No file selected for conversion.');
        return;
      }

      if (!uri.fsPath.endsWith('.svg')) {
        vscode.window.showErrorMessage('The selected file is not a .svg file.');
        return;
      }

      const svgPath = uri.fsPath;

      try {
        const svgContent = await fs.readFile(svgPath, 'utf-8');
        const componentName = path
          .basename(svgPath, '.svg')
          .replace(/[^a-zA-Z0-9]/g, '')
          .replace(/^\w/, (c) => c.toUpperCase());

        const jsx = await transform(
          svgContent,
          {
            icon: true,
            plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          },
          { componentName }
        );

        const newFilePath = path.join(
          path.dirname(svgPath),
          `${componentName}.jsx`
        );
        await fs.writeFile(newFilePath, jsx);

        vscode.window.showInformationMessage(
          `Successfully created ${componentName}.jsx`
        );
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error('SVGR Conversion failed!', e);
        vscode.window.showErrorMessage(
          `SVGR Conversion Failed: ${errorMessage}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
