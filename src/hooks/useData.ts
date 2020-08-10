import { WorkspaceData } from "types/index";
import { DocumentRoot } from "types/appTypes";
import { mdParagraph, mdNodeType } from "types/mdastTypes";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import images from "remark-images";
import remark2rehype from "remark-rehype";
import rehype2remark from "rehype-remark";
import html from "rehype-stringify";
import parseHtml from "rehype-parse";
import unified from "unified";
import { AppData, DocumentPosition, ElectronMarkdownFile } from "types";
import { Node } from "unist";
import { createNewBrowser } from "../actions/creatorAppData";
import { createDocumentRoot } from "../actions/creatorAppElements";
import { PAGE_WIDTH, PAGE_PADDING } from "misc/constants";
import { blankLine, paragraph } from "./remarkOverrides";

function customText() {
  // @ts-ignore
  const compiler = this.Compiler;
  const visitors = compiler.prototype.visitors;

  function unescapedText(node: Node, parent: Node) {
    return node.value;
  }

  visitors.text = unescapedText;
}

function customParser() {
  // @ts-ignore
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  // Replace the paragraph tokenizer to keep empty lines
  // tokenizers.paragraph = paragraph;
  // tokenizers.blankLine = blankLine;
}

// @ts-ignore
// markdown.Parser.prototype.blockTokenizers.blankLine = blankLine;

export const markdownProcessor = unified()
  .use(markdown)
  .use(stringify, {
    bullet: "-",
    fence: "~",
    fences: true,
    incrementListMarker: false,
  })
  .use(images)
  .use(customText);

export const remarkToHtmlProcessor = unified()
  .use(markdown)
  .use(images)
  .use(remark2rehype)
  .use(html);

export const htmlProcessor = unified()
  .use(parseHtml)
  .use(rehype2remark)
  .use(stringify);

// eslint-disable-next-line
const input = `I am some _paragraph_ text. I am some __strong paragraph__ text.

# Hello _World_ I am __strong__

***

${"```\nconsole.log()\nconsole.log()\n```"}

> "This is a quote from someone"

1. Numbered list
a. Test
1. Yes let's see
a. Okay
b. Alright

- bulleted list
- test two
  - alrigh alright
- test three
- list 2

`;
// eslint-disable-next-line
const input2 = `
# Header

P __strong *italic* strong__ okay

I am a paragraph
`;
// eslint-disable-next-line
const input3 = `
p1 dy okay so when we wrap we want it to be like this

okay ![Meme](https://cdn.ebaumsworld.com/mediaFiles/picture/2452130/85388216.jpg) hello! wow I can't belive that works

alright alright alright okay okay okay

t1
`;
// eslint-disable-next-line
const input4 = `
p1

- hi
    - yo
    - test
`;
// eslint-disable-next-line
const input5 = `# Header

paragraph
 
 
 
 
 
 
 
 
 
paragraph

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   s

Another paragraph
`;
// eslint-disable-next-line
const welcomeInput = `
# Welcome!

Polished is a text editor that flexes to your writing process.

## The Canvas

The canvas is the defining feature of polished. You can open web pages and documents in the canvas. Move them around. Advanced editing features are coming that will allow you to drag blocks of content between documents. The goal is to recreate the feel of paper in an infinite digital canvas.

### Documents and Browsers

Click on a document or browser in the "Open Editors" explorer on the left to jump to a document. The four arrows icon in the top left of documents can be used to drag documents around. The 'X' in the top right will remove them. This is a sandbox so if something breaks, just refresh the page!

### Pan + Zoom

Click and drag on the canvas to pan the view. If you have a trackpad, doing the pinch gesture should zoom in and out of the canvas.

## Markdown

Polished is a text editor that live renders markdown. Headers, __bold__, and _italic_ text, and lists are currently supported. Image and Link support are in beta. The rest of the markdown spec will eventually be implemented.

## Configurability

Polished is built to be customized to the way you write. You'll be able to configure the behavior of nearly every feature. Sets of configurations are grouped into "writing modes" that you can easily toggle using the icons on the right menu bar. Click the gear icon at the bottom of the bar to add a new mode and re-configure the existing ones.

## Offline First

The first version of Polished is built as a desktop app. You can edit .txt and .md files on your own computer. Edit offline. Choose your own storage options. I'm focused on building a great editor first. Cloud storage may come later. Rest assured, your files and data will never be locked up in a proprietary format.

## Connect With Me

Writing well is one of the most important skills to have in the internet age. I'm working to make Polished the best place to write well. If you're passionate about writing, have ideas, or just want to connect, please do! I'm [@rywils21](https://twitter.com/rywils21) on Twitter or you can email me at ryan@polished.app.
`;

export const parsed = markdownProcessor.parse(welcomeInput);

export function loadDemoData(data: AppData): void {
  console.log("-------------------- TEST --------------------");
  console.log(parsed);
  console.log("------------------ END TEST ------------------");
  const docRoot = createDocumentRoot(
    // @ts-ignore
    parsed,
    getStartingXY(data.activeWorkspace),
    "Welcome.md"
  );
  data.selectedWorkspace = "Demo";
  data.workspaces = {
    Demo: {
      name: "Demo",
      rootDir: "/",
      files: [],
      documents: [docRoot],
      browsers: [
        {
          dragging: false,
          height: 800,
          width: 1000,
          position: { x: -791, y: 100 },
          resizing: [],
          src: "https://polished.app/work-in-progress",
        },
      ],
      selection: [],
      view: { x: 0, y: 0, zoom: 1 },
    },
  };
  centerViewOnPosition(data, docRoot.position);
}

export const mdParagraphMock: mdParagraph = {
  type: mdNodeType.PARAGRAPH,
  children: [
    {
      type: mdNodeType.TEXT,
      value: "Hello",
    },
  ],
};

export function getStartingXY(
  workspace: WorkspaceData | null
): DocumentPosition {
  let rightMostDocument = 0;
  let y = 100;
  if (workspace) {
    workspace.documents.forEach((doc: DocumentRoot) => {
      if (doc.position.x + doc.width > rightMostDocument) {
        rightMostDocument = doc.position.x + doc.width;
        y = doc.position.y;
      }
    });
  }
  const x = rightMostDocument + 400;

  return { x, y };
}

export function loadMarkdownFile(
  markdownFile: ElectronMarkdownFile,
  appData: AppData
): DocumentRoot {
  const ast = markdownProcessor.parse(markdownFile.content);
  const docRoot = createDocumentRoot(
    // @ts-ignore
    ast,
    getStartingXY(appData.activeWorkspace),
    markdownFile.path
  );
  docRoot.cleanupNodes();

  return docRoot;
}

export function centerViewOnPosition(
  data: AppData,
  position: DocumentPosition
) {
  let width = window.innerWidth;
  if (data.svgElement && data.svgElement.current) {
    const box = data.svgElement.current.getBoundingClientRect();
    width = box.width;
  }

  if (data.activeWorkspace !== null) {
    const docWidth = PAGE_WIDTH + PAGE_PADDING + PAGE_PADDING;

    data.activeWorkspace.view.x =
      width / 2 - (docWidth / 2 + position.x) * data.activeWorkspace.view.zoom;
    data.activeWorkspace.view.y = -1 * position.y + 200;
  }
}

function getNextNewFilePath(data: AppData): string {
  const usedNumbers: number[] = [];

  if (data.activeWorkspace) {
    data.activeWorkspace.files.forEach((filepath: string) => {
      if (filepath.indexOf("untitled-") > -1) {
        const stringNumber = filepath
          .slice(filepath.indexOf("untitled-") + "untitled-".length)
          .replace(".md", "")
          .replace(".txt", "");
        try {
          const n = parseInt(stringNumber);
          usedNumbers.push(n);
        } catch (e) {
          // do nothing
        }
      }
    });
    data.activeWorkspace.documents.forEach((doc: DocumentRoot) => {
      const filepath = doc.path || "";
      if (filepath.indexOf("untitled-") > -1) {
        const stringNumber = filepath
          .slice(filepath.indexOf("untitled-") + "untitled-".length)
          .replace(".md", "")
          .replace(".txt", "");
        try {
          const n = parseInt(stringNumber);
          usedNumbers.push(n);
        } catch (e) {
          // do nothing
        }
      }
    });
  }
  let number = 1;

  while (usedNumbers.indexOf(number) > -1) {
    number += 1;
  }

  return `${data.activeWorkspace?.rootDir}/untitled-${number}.md`;
}

export function loadNewMarkdownFile(data: AppData) {
  const position = getStartingXY(data.activeWorkspace);
  const path = getNextNewFilePath(data);
  if (data.activeWorkspace) {
    const docRoot = createDocumentRoot(
      {
        type: mdNodeType.ROOT,
        children: [
          {
            type: mdNodeType.PARAGRAPH,
            children: [
              {
                type: mdNodeType.TEXT,
                value: "",
              },
            ],
          },
        ],
      },
      position,
      path
    );
    docRoot.cleanupNodes();

    data.activeWorkspace.documents.push(docRoot);

    centerViewOnPosition(data, position);

    if (data.activeWorkspace) {
      data.activeWorkspace.selection = [
        {
          documentIndex: data.activeWorkspace.documents.length - 1,
          start: {
            block: 0,
            offset: -1,
          },
          end: {
            block: 0,
            offset: -1,
          },
        },
      ];
    }

    if (data.svgElement && data.svgElement.current) {
      data.svgElement.current.focus();
    }
  }
}

export function loadNewWebBrowser(data: AppData) {
  if (data.activeWorkspace) {
    data.activeWorkspace.browsers.push(createNewBrowser(data));

    const position =
      data.activeWorkspace.browsers[data.activeWorkspace.browsers.length - 1]
        .position;

    centerViewOnPosition(data, position);
  }
}
