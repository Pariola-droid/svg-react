import * as vscode from 'vscode';
import { refactorFile } from '../utils/refactorFile';

export async function refactorFileHandler(uri: vscode.Uri, uris: vscode.Uri[]) {
  let filesToRefactor = uris || (uri ? [uri] : []);
  if (filesToRefactor.length === 0) {
    const selectedFiles = await vscode.window.showOpenDialog({
      canSelectMany: true,
      openLabel: 'Select Component(s) to Refactor',
      filters: { 'React Components': ['jsx', 'tsx'] },
    });
    if (selectedFiles) {
      filesToRefactor = selectedFiles;
    }
  }
  if (filesToRefactor.length === 0) {
    vscode.window.showInformationMessage(
      'No component files selected to refactor.'
    );
    return;
  }

  const results = await Promise.allSettled(
    filesToRefactor.map((fileUri) => refactorFile(fileUri))
  );
  let totalFilesChanged = 0;
  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      totalFilesChanged += r.value; // is 1 if changed, else 0
    }
  });

  if (totalFilesChanged > 0) {
    vscode.window.showInformationMessage(
      `Refactoring complete. Fixed attributes in ${totalFilesChanged} of ${filesToRefactor.length} file(s).`
    );
  } else {
    vscode.window.showInformationMessage(
      `No attributes needed fixing in the selected ${filesToRefactor.length} file(s).`
    );
  }
}
