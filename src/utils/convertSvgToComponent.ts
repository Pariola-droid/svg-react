import { transform } from '@svgr/core';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { formatComponentName } from './formatComponentName';
//
import jsx from '@svgr/plugin-jsx';
import prettier from '@svgr/plugin-prettier';
import svgo from '@svgr/plugin-svgo';

/**
 * Converts a single SVG file to a React component based on user settings.
 * @param uri The URI of the SVG file to convert.
 * @returns The name of the generated component.
 */

export async function convertSvgToComponent(uri: vscode.Uri) {
  const svgPath = uri.fsPath;
  const config = vscode.workspace.getConfiguration('svgreact');
  const outputDir = config.get<string>('outputDir', '.');
  const useTypescript = config.get<boolean>('typescript', false);
  const useNative = config.get<boolean>('native', false);
  const namePrefix = config.get<string>('componentNamePrefix', '');

  const svgrOptions = {
    native: useNative,
    icon: config.get<boolean>('icon', true),
    memo: config.get<boolean>('memo', false),
    ref: config.get<boolean>('ref', false),
    typescript: useTypescript,
    exportType: config.get<'default' | 'named'>('exportType', 'default'),
    plugins: [svgo, jsx, prettier],
  };

  const svgContent = await fs.readFile(svgPath, 'utf-8');

  const baseName = path.basename(svgPath, '.svg');
  const componentName = formatComponentName(baseName, namePrefix);

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
