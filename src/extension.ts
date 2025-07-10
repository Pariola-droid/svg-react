import { transform } from '@svgr/core';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
//
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

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

  return outputFilename;
}

function getWebviewContent(svgContent: string): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SVG Preview</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #222;
        }
        img {
          max-width: 90%;
          max-height: 90%;
        }
      </style>
  </head>
  <body>
      <img src="data:image/svg+xml;base64,${Buffer.from(svgContent).toString(
        'base64'
      )}" />
  </body>
  </html>`;
}

export function activate(context: vscode.ExtensionContext) {
  const convertCommand = vscode.commands.registerCommand(
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
          vscode.window.showInformationMessage(
            `Successfully converted SVG to component: ${res.value}`
          );
        }
      } else if (succeeded > 1) {
        vscode.window.showInformationMessage(
          `Successfully converted ${succeeded} SVG(s) to components.`
        );
      }
    }
  );

  const previewCommand = vscode.commands.registerCommand(
    'svgreact.preview',
    async (uri: vscode.Uri) => {
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
  );

  const previewComponentCommand = vscode.commands.registerCommand(
    'svgreact.previewComponent',
    async (uri: vscode.Uri) => {
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

        traverse(ast, {
          JSXElement(path) {
            if (
              t.isJSXIdentifier(path.node.openingElement.name, { name: 'svg' })
            ) {
              svgNode = path.node;
              path.stop();
            }
          },
        });

        if (svgNode) {
          const svgCompliantAst = t.cloneNode(svgNode, true, true);

          traverse(svgCompliantAst, {
            noScope: true,
            JSXAttribute(path) {
              // strokeWidth -> stroke-width
              if (t.isJSXIdentifier(path.node.name)) {
                const name = path.node.name.name;
                const newName = name.replace(
                  /[A-Z]/g,
                  (letter) => `-${letter.toLowerCase()}`
                );
                if (name !== newName) {
                  path.node.name.name = newName;
                }
              }

              // width={24} - width="24"
              if (t.isJSXExpressionContainer(path.node.value)) {
                const expression = path.node.value.expression;
                if (
                  t.isNumericLiteral(expression) ||
                  t.isStringLiteral(expression)
                ) {
                  path.node.value = t.stringLiteral(String(expression.value));
                } else {
                  path.remove();
                }
              }
            },
          });

          const { code } = generate(svgCompliantAst);

          const panel = vscode.window.createWebviewPanel(
            'svgComponentPreview',
            `Preview: ${path.basename(uri.fsPath)}`,
            vscode.ViewColumn.One,
            {}
          );
          panel.webview.html = getWebviewContent(code);
        } else {
          vscode.window.showInformationMessage(
            'No SVG element found in this component.'
          );
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        vscode.window.showErrorMessage(
          `Failed to parse component: ${errorMessage}`
        );
        console.error(e);
      }
    }
  );

  context.subscriptions.push(
    convertCommand,
    previewCommand,
    previewComponentCommand
  );
}

export function deactivate() {}
