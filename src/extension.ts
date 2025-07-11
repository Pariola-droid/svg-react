import * as vscode from 'vscode';
import {
  convertFileHandler,
  previewHandler,
  previewSelectionHandler,
  refactorFileHandler,
  refactorSelectionHandler,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  const convertCommand = vscode.commands.registerCommand(
    'svgreact.convertFile',
    convertFileHandler
  );

  const previewCommand = vscode.commands.registerCommand(
    'svgreact.preview',
    previewHandler
  );

  const refactorCommand = vscode.commands.registerCommand(
    'svgreact.refactor',
    refactorFileHandler
  );

  const refactorSelectionCommand = vscode.commands.registerCommand(
    'svgreact.refactorSelection',
    refactorSelectionHandler
  );

  const previewSelectionCommand = vscode.commands.registerCommand(
    'svgreact.previewSelection',
    previewSelectionHandler
  );

  context.subscriptions.push(
    convertCommand,
    previewCommand,
    refactorCommand,
    refactorSelectionCommand,
    previewSelectionCommand
  );
}

export function deactivate() {}
