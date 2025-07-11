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
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #fafafa;
        }
        #container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: grab;
        }
        #container.grabbing {
            cursor: grabbing;
        }
        img {
          max-width: 90%;
          max-height: 90%;
          transition: transform 0.1s ease-out;
          transform-origin: center center;
        }
      </style>
  </head>
  <body>
      <div id="container">
        <img id="svg-image" src="data:image/svg+xml;base64,${Buffer.from(
          svgContent
        ).toString('base64')}" />
      </div>

      <script>
        const container = document.getElementById('container');
        const image = document.getElementById('svg-image');

        let scale = 1;
        let isPanning = false;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;

        function applyTransform() {
            image.style.transform = \`translate(\${translateX}px, \${translateY}px) scale(\${scale})\`;
        }

        container.addEventListener('wheel', (event) => {
            event.preventDefault();
            const scaleAmount = 0.1;
            if (event.deltaY < 0) {
                scale += scaleAmount;
            } else {
                scale = Math.max(0.1, scale - scaleAmount);
            }
            applyTransform();
        });

        container.addEventListener('mousedown', (event) => {
            isPanning = true;
            container.classList.add('grabbing');
            startX = event.pageX - translateX;
            startY = event.pageY - translateY;
        });

        container.addEventListener('mouseup', () => {
            isPanning = false;
            container.classList.remove('grabbing');
        });

        container.addEventListener('mouseleave', () => {
            isPanning = false;
            container.classList.remove('grabbing');
        });

        container.addEventListener('mousemove', (event) => {
            if (isPanning) {
                translateX = event.pageX - startX;
                translateY = event.pageY - startY;
                applyTransform();
            }
        });

      </script>
  </body>
  </html>`;
}
