import * as vscode from 'vscode';
import { convertSvgToComponent } from '../utils/convertSvgToComponent';

export async function convertFileHandler(uri: vscode.Uri, uris: vscode.Uri[]) {
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
