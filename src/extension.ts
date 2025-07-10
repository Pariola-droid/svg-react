import { transform } from '@svgr/core';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'svgreact.convertFile',
    async (uri: vscode.Uri) => {
      const svgPath = uri.fsPath;
      const svgContent = await fs.readFile(svgPath, 'utf-8');

      const componentName = path
        .basename(svgPath, '.svg')
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^\w/, (c) => c.toUpperCase());

      try {
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
        vscode.window.showErrorMessage(`SVGR conversion failed: ${e}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
