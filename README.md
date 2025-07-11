# SVGReact: Your All-in-One SVG Toolkit for React

Tired of juggling SVGs? Manually converting `kebab-case` to `camelCase`, pasting huge blocks of code inline, or jumping over to a website just to convert one file? Me too. That's why I built **SVGReact**.

This isn't just another converter. It's a complete, native toolkit for VS Code designed to make working with SVGs in React feel seamless and intuitive, just like it should be.

## What It Does

### 🚀 Convert SVGs to Components, Instantly

Grab one SVG (or a hundred!) from the file explorer, right-click, and convert them all into clean, optimized React components. No more one-by-one conversions.

![Instant SVG conversion!](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-conversion.gif)

### ✨ Fix Messy SVGs with One Click

Inherited a project with messy inline SVGs? We've all been there. Just highlight a block of code or right-click a file, and the sanitize command will instantly fix invalid attributes (like `stroke-width`) into valid JSX props (`strokeWidth`).

![Fix messy codes!](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-sanitize-select.gif)

### 🔍 Advanced Interactive Previews

Instantly preview any `.svg` file or even the SVG code inside your existing React components. The interactive webview allows you to zoom and pan, making it perfect for inspecting complex icons.

![SVG preview!](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-preview.gif)

### ⚙️ Make It Your Own

Your project, your rules. Tweak everything in your `settings.json`—output directories, TypeScript support, React Native mode, component prefixes, and more. Make the output match your codebase perfectly.

![Custom settings](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-settings.gif)

## How to Use It

Here are the commands you'll be using. You can find them in the right-click context menu or by searching "SVGR" in the Command Palette (`Cmd+Shift+P`).

| Command                                    | What it does                                         | Where to find it               |
| :----------------------------------------- | :--------------------------------------------------- | :----------------------------- |
| **SVGR: Convert to React Component**       | Turns `.svg` files into React components.            | File Explorer, Command Palette |
| **SVGR: Preview SVG File**                 | Opens a preview of an `.svg` file.                   | File Explorer, Command Palette |
| **SVGR: Preview Component's SVG**          | Previews the SVG inside a `.jsx` or `.tsx` file.     | File Explorer, Command Palette |
| **SVGR: Preview Selected SVG**             | Previews only the SVG code you've highlighted.       | Editor Context Menu            |
| **SVGR: Sanitize SVG Attributes in File**  | Fixes all SVG attributes in a `.jsx` or `.tsx` file. | File Explorer, Command Palette |
| **SVGR: Sanitize Attributes in Selection** | Fixes SVG attributes within the selected text block. | Editor Context Menu            |

## Extension Settings

Customize the extension's behavior by adding these settings to your user or workspace `settings.json` file.

| Setting                        | Type      | Default   | Description                                                                                                        |
| :----------------------------- | :-------- | :-------- | :----------------------------------------------------------------------------------------------------------------- |
| `svgreact.outputDir`           | `string`  | `.`       | The directory where new components are saved. `.` means the same folder as the source SVG.                         |
| `svgreact.typescript`          | `boolean` | `false`   | If true, generates a `.tsx` file with TypeScript types.                                                            |
| `svgreact.native`              | `boolean` | `false`   | If true, generates a React Native compatible component.                                                            |
| `svgreact.memo`                | `boolean` | `false`   | If true, wraps the generated component in `React.memo()`.                                                          |
| `svgreact.ref`                 | `boolean` | `false`   | If true, forwards a `ref` to the underlying SVG element.                                                           |
| `svgreact.icon`                | `boolean` | `true`    | If true, applies `1em` height and width for easy icon scaling.                                                     |
| `svgreact.exportType`          | `string`  | `default` | Set to `named` for a named export instead of a default export.                                                     |
| `svgreact.componentNamePrefix` | `string`  | `""`      | A prefix to add to all generated component names (e.g., setting to `"Icon"` will turn `user.svg` into `IconUser`). |

### Example Configuration (`.vscode/settings.json`)

```json
{
  "svgreact.outputDir": "src/components/icons",
  "svgreact.typescript": true,
  "svgreact.componentNamePrefix": "Icon",
  "svgreact.memo": true
}
```

## Usage

### Converting an SVG

1. In the File Explorer, right-click on a `.svg` file (or select multiple files).
2. Select **"SVGR: Convert to React Component"**.
3. A new component file will be created based on your settings.

### Previewing an SVG

1. **To preview an SVG file:** Right-click on the `.svg` file in the Explorer and select **"SVGR: Preview SVG File"**.
2. **To preview an SVG inside a component:** Right-click on the `.jsx`/`.tsx` file and select **"SVGR: Preview Component's SVG"**.
3. **To preview a specific part:** Highlight the `<svg>...</svg>` code block in the editor, right-click, and select **"SVGR: Preview Selected SVG"**.

### Sanitizing an SVG Component

1. Open a `.jsx` or `.tsx` file containing an inline SVG with invalid attributes (e.g., `stroke-width`).
2. **To sanitize the whole file:** Right-click on the file in the Explorer and select **"SVGR: Sanitize SVG Attributes in File"**.
3. **To sanitize a specific part:** Highlight the SVG code block in the editor, right-click, and select **"SVGR: Sanitize Attributes in Selection"**.

## Release Notes

### 1.1.0

- **New Feature:** Added advanced interactive previews for existing React components and selected SVG code.
- **New Feature:** Preview webview now supports zoom and pan.

### 1.0.0 - 1.0.4

- Initial release of SVGReact.
- Added core conversion, preview, and sanitize features.
- Full configuration support via `settings.json`.
- Critical bug fixes for production builds and dependency management.

## Contributing

If you have ideas for improvements or find bugs, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Pariola-droid/svg-react).

**Enjoy the extension! Hope it saves you as much time as it saves me.**
