import * as vscode from 'vscode';
import {
  convertFileHandler,
  previewHandler,
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

  context.subscriptions.push(
    convertCommand,
    previewCommand,
    refactorCommand,
    refactorSelectionCommand
  );
}

export function deactivate() {}
