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
    'svgreact.previewFile',
    previewFileHandler
  );

  const refactorFileCommand = vscode.commands.registerCommand(
    'svgreact.refactorFile',
    refactorFileHandler
  );

  const refactorSvgSelectionCommand = vscode.commands.registerCommand(
    'svgreact.refactorSvgSelection',
    refactorSvgSelectionHandler
  );

  const previewSvgComponentCommand = vscode.commands.registerCommand(
    'svgreact.previewSvgComponent',
    previewSvgComponentHandler
  );

  const previewSvgSelectionCommand = vscode.commands.registerCommand(
    'svgreact.previewSvgSelection',
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
