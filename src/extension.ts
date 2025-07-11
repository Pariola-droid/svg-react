import * as vscode from 'vscode';
import {
  convertFileHandler,
  previewFileHandler,
  previewSvgComponentHandler,
  previewSvgSelectionHandler,
  refactorFileHandler,
  refactorSvgSelectionHandler,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  const convertFileCommand = vscode.commands.registerCommand(
    'svgreact.convertFile',
    convertFileHandler
  );

  const previewFileCommand = vscode.commands.registerCommand(
    'svgreact.preview',
    previewFileHandler
  );

  const refactorFileCommand = vscode.commands.registerCommand(
    'svgreact.refactor',
    refactorFileHandler
  );

  const refactorSvgSelectionCommand = vscode.commands.registerCommand(
    'svgreact.refactorSelection',
    refactorSvgSelectionHandler
  );

  const previewSvgComponentCommand = vscode.commands.registerCommand(
    'svgreact.previewComponent',
    previewSvgComponentHandler
  );

  const previewSvgSelectionCommand = vscode.commands.registerCommand(
    'svgreact.previewSelection',
    previewSvgSelectionHandler
  );

  context.subscriptions.push(
    convertFileCommand,
    previewFileCommand,
    refactorFileCommand,
    refactorSvgSelectionCommand,
    previewSvgComponentCommand,
    previewSvgSelectionCommand
  );
}

export function deactivate() {}
