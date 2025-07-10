import { transform } from '@svgr/core';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  const disposable = vscode.commands.registerCommand(
    'svgreact.convertFile',
    async (uri: vscode.Uri) => {
      // If the command is run from the command palette, uri will be undefined.
      // In that case, we use the active editor's file.
      if (!uri && vscode.window.activeTextEditor) {
        uri = vscode.window.activeTextEditor.document.uri;
      }

      // If we still don't have a URI, we can't proceed.
      if (!uri) {
        vscode.window.showErrorMessage('No SVG file selected or active.');
        return;
      }

      // Check if the file is an SVG
      if (!uri.fsPath.endsWith('.svg')) {
        vscode.window.showErrorMessage('Please select a .svg file.');
        return;
      }

      const svgPath = uri.fsPath;
      const svgContent = await fs.readFile(svgPath, 'utf-8');

      // Determine a component name from the file name (e.g., icon-find.svg -> IconFind)
      const componentName = path
        .basename(svgPath, '.svg')
        .split(/[-_]/) // Split by hyphen or underscore
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
        .join(''); // Join them together

      try {
        // Transform the SVG content into a React component
        const jsx = await transform(
          svgContent,
          {
            icon: true, // Example option, we'll make this configurable later
            plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          },
          { componentName }
        );

        // Create the new file path
        const newFilePath = path.join(
          path.dirname(svgPath),
          `${componentName}.jsx`
        );
        await fs.writeFile(newFilePath, jsx);

        // Show a success message
        vscode.window.showInformationMessage(
          `Successfully created ${componentName}.jsx`
        );
      } catch (e) {
        // Show an error message if something goes wrong
        const errorMessage = e instanceof Error ? e.message : String(e);
        vscode.window.showErrorMessage(
          `SVGR conversion failed: ${errorMessage}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
