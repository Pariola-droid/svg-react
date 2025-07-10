/**
 * Generates the HTML content for the SVG preview webview.
 * @param svgContent The raw string content of the SVG file.
 * @returns A complete HTML string to be displayed in the webview.
 */

export function getWebviewContent(svgContent: string): string {
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
