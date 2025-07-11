# SVGReact: Your All-in-One SVG Toolkit for React

Tired of juggling SVGs? Manually converting `kebab-case` to `camelCase`, pasting huge blocks of code inline, or jumping over to a website just to convert one file? Me too. That's why I built **SVGReact**.

This isn't just another converter. It's a complete, native toolkit for VS Code designed to make working with SVGs in React feel seamless and intuitive, just like it should be.

## What It Does

### 🚀 Convert SVGs to Components, Instantly

Grab one SVG (or a hundred!) from the file explorer, right-click, and convert them all into clean, optimized React components. No more one-by-one conversions.

![Instant SVG conversion!](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-conversion.gif)
_(Animation showing multi-select in the file explorer, right-clicking, and converting)_

### ✨ Fix Messy SVGs with One Click

Inherited a project with messy inline SVGs? We've all been there. Just highlight a block of code or right-click a file, and the sanitize command will instantly fix invalid attributes (like `stroke-width`) into valid JSX props (`strokeWidth`).

![Fix messy codes!](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-sanitize-select.gif)
_(Animation showing a user selecting a block of messy SVG code, right-clicking, and choosing "SVGR: Sanitize SVG Attributes in File")_

## ⚙️ Make It Your Own

Your project, your rules. Tweak everything in your `settings.json`—output directories, TypeScript support, React Native mode, component prefixes, and more. Make the output match your codebase perfectly.

![Custom settings](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-settings.gif)
_(Animation showing a user editing the `svgreact._`settings in`settings.json`)\_

### 🔍 Preview Before You Commit

Not sure which `next.svg` is the right one? Right-click and hit "Preview" to see the SVG in a new tab before you do anything else.

![SVG preview!](https://pub-f746c03a0c4b41d0b834b41fd9188a31.r2.dev/svgr-preview.gif)
_(Animation showing a user right-clicking an SVG and selecting "SVGR: Preview SVG")_

## How to Use It

Here are the commands you'll be using. You can find them in the right-click context menu or by searching "SVGR" in the Command Palette (`Cmd+Shift+P`).

| Command                                    | What it does                                         | Where to find it               |
| :----------------------------------------- | :--------------------------------------------------- | :----------------------------- |
| **SVGR: Convert to React Component**       | Turns `.svg` files into React components.            | File Explorer, Command Palette |
| **SVGR: Preview SVG**                      | Opens a quick visual preview of an `.svg` file.      | File Explorer, Command Palette |
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

### Sanitize an SVG Component

1. Open a `.jsx` or `.tsx` file containing an inline SVG with invalid attributes (e.g., `stroke-width`).
2. **To sanitize the whole file:** Right-click on the file in the Explorer and select **"SVGR: Sanitize SVG Attributes in File"**.
3. **To sanitize a specific part:** Highlight the SVG code block in the editor, right-click, and select **"SVGR: Sanitize Attributes in Selection"**.

## Release Notes

### 1.0.0 - Initial Release

- Initial release of SVGReact.
- Added core conversion, preview, and sanitize features.
- Full configuration support via `settings.json`.
- Support for multi-file conversion and selection-based refactoring.

## Contributing

If you have ideas for improvements or find bugs, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Pariola-droid/svg-react).

**Enjoy the extension! Hope it saves you as much time as it saves me.**
