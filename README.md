# nw-me
NodeWebkit (nwjs) meets MediumEditor.

A very simple WYSIWYG editor for static HTML pages that can be saved locally and deployed to a static host such as S3.
The inline HTML editing is provided by [MediumEditor](https://github.com/yabwe/medium-editor) and the file management is handled in node.js
by way of [nwjs](https://github.com/nwjs/nw.js)

DOM manipulation is handled by jquery in the browser and [Cheerio](https://github.com/cheeriojs/cheerio) in node.js.

## Use Case

There seems to be a CMS out there for just about everything. However, I couldn't find one that would check these boxes:
* Free to use and 100% Open Source
* Editable directly on the page (full WYSIWYG)
* Start with a set of static interlinked HTML files (built on any client side framework and with any content)
* One-click staging/publish as completely static HTML files to be hosted on S3 or similar.

## Install

```bash
npm i -S nw-me
```

## Usage

Create the folder structure and index.js:
```bash
var nwme = require('nw-me');
nwme.init();
```

Drop your static HTML files and any associated scripts and assets into the "original" folder.

For any HTML element that you want to make editable, specify a data attribute as follows:

```html
<h1 data-editable="header.title">Welcome to NW-ME</h1>
```

The variable name (e.g. `header.title`) should be unique (unless the content is intended to be repeated). This can be any element with text content (including tags such as `<b>, <i> <a>` etc). See [MediumEditor Documentation](https://github.com/yabwe/medium-editor) for more information.

### Running the Application

Run `npm init` and configure your package.json in accordance with the NWJS documentation.

Launch the NWJS application

Switch between "Edit Mode" and "View Mode" to edit content or navigate between HTML pages. Changes are saved when you toggle back to "View Mode".

### Deployment
TODO

### Behind the scenes

1. If the `editing` folder is empty, all files from `original` are copied to `edit`
2. Medium-Editor scripts and nw-js scripts are copied to the `editing` folder
3. Script tags are added to the head and body elements of all your .html files
4. Any edits made in the tool are saved by modifying the HTML file directly (not from the Browser DOM which may have changed via script).
5. For deployment as static files, all files from `original` are copied to `deploy`; html files from edit are copied to `deploy` with all temporary data tags and scripts removed.

## License

[MIT](https://opensource.org/licenses/MIT)
