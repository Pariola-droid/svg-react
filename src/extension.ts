import { transform } from '@svgr/core';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

async function convertSvgToComponent(uri: vscode.Uri) {
  const svgPath = uri.fsPath;

  const config = vscode.workspace.getConfiguration('svgreact');
  const outputDir = config.get<string>('outputDir', '.');
  const useTypescript = config.get<boolean>('typescript', false);
  const useNative = config.get<boolean>('native', false);

  const svgrOptions = {
    native: useNative,
    icon: config.get<boolean>('icon', true),
    memo: config.get<boolean>('memo', false),
    ref: config.get<boolean>('ref', false),
    typescript: useTypescript,
    exportType: config.get<'default' | 'named'>('exportType', 'default'),
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  };

  const svgContent = await fs.readFile(svgPath, 'utf-8');
  const componentName = path
    .basename(svgPath, '.svg')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^\w/, (c) => c.toUpperCase());

  const componentCode = await transform(svgContent, svgrOptions, {
    componentName,
  });

  const fileExtension = useTypescript ? '.tsx' : '.jsx';
  const outputFilename = `${componentName}${fileExtension}`;

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  const rootPath = workspaceFolder
    ? workspaceFolder.uri.fsPath
    : path.dirname(svgPath);

  const newFilePath = path.resolve(rootPath, outputDir, outputFilename);

  await fs.mkdir(path.dirname(newFilePath), { recursive: true });
  await fs.writeFile(newFilePath, componentCode);
  return componentName;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'svgreact.convertFile',
    async (uri: vscode.Uri, uris: vscode.Uri[]) => {
      let filesToConvert = uris || (uri ? [uri] : []);

      if (filesToConvert.length === 0) {
        const selectedFiles = await vscode.window.showOpenDialog({
          canSelectMany: true,
          openLabel: 'Select SVG(s) to Convert',
          filters: { 'SVG files': ['svg'] },
        });

        if (selectedFiles) {
          filesToConvert = selectedFiles;
        }
      }

      if (filesToConvert.length === 0) {
        console.log('Execution cancelled: No files were selected.');
        vscode.window.showInformationMessage(
          'No SVG files selected for conversion.'
        );
        return;
      }

      const results = await Promise.allSettled(
        filesToConvert.map((fileUri) => convertSvgToComponent(fileUri))
      );

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected');

      if (failed.length > 0) {
        console.error(
          `${failed.length} conversions failed:`,
          failed.map((f) => (f as PromiseRejectedResult).reason)
        );
        vscode.window.showErrorMessage(
          `Failed to convert ${failed.length} of ${results.length} files. See console for details.`
        );
      }

      if (succeeded === 1) {
        const res = results.find((r) => r.status === 'fulfilled') as
          | PromiseFulfilledResult<string>
          | undefined;

        if (res) {
          const componentName = res.value;
          vscode.window.showInformationMessage(
            `Successfully converted SVG to component: ${componentName}`
          );
        }
      } else if (succeeded > 1) {
        vscode.window.showInformationMessage(
          `Successfully converted ${succeeded} SVG(s) to components.`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
