import { DocumentRoot } from "types/appTypes";
import { markdownProcessor } from "../../hooks/useData";
import {
  createDocumentRoot,
  loadDocumentFromMarkdown,
  stringifyDocumentRoot,
} from "../../actions/creatorAppElements";
import { SelectionRange } from "../../types/index";

describe("document cut, copy, and paste", () => {
  let document: DocumentRoot;

  beforeEach(() => {
    const input = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    document = loadDocumentFromMarkdown(input);
  });

  it("should cut and paste back the paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 1,
        offset: 12,
      },
    };

    const copiedDoc = document.cutRange(range);

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 1, offset: 12 });
    expect(range.end).toEqual({ block: 1, offset: 12 });
  });

  it("should cut and paste back the paragraph twice", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 1,
        offset: 12,
      },
    };

    const copiedDoc = document.cutRange(range);

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);
    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okayP **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 1, offset: 25 });
    expect(range.end).toEqual({ block: 1, offset: 25 });
  });

  it("should copy and paste over the paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 1,
        offset: 12,
      },
    };

    const copiedDoc = document.copyRange(range);

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 1, offset: 12 });
    expect(range.end).toEqual({ block: 1, offset: 12 });
  });

  it("should copy and paste the paragraph in the middle", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 1,
        offset: 12,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.offset = 8;
    range.end.offset = 8;

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** P **strong** okayokay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 1, offset: 21 });
    expect(range.end).toEqual({ block: 1, offset: 21 });
  });

  it("should copy and paste multiple paragraphs", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 2;
    range.start.offset = 18;

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraphP **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 3, offset: 18 });
    expect(range.end).toEqual({ block: 3, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly within paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 2;
    range.start.offset = 16;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraP **strong** okay

This is a paragraphph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 3, offset: 18 });
    expect(range.end).toEqual({ block: 3, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at end of first list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 3;
    range.start.offset = 15;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element oneP **strong** okay
    This is a paragraph
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 4, offset: 18 });
    expect(range.end).toEqual({ block: 4, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at end of first sub list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 5;
    range.start.offset = 15;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list elementP **strong** okay
        This is a paragraph
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: 18 });
    expect(range.end).toEqual({ block: 6, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly in middle of first sub list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 5;
    range.start.offset = 10;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list elP **strong** okay
        This is a paragraphement
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: 18 });
    expect(range.end).toEqual({ block: 6, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at start of first sub list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 5;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   P **strong** okay
        This is a paragraphsub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: 18 });
    expect(range.end).toEqual({ block: 6, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at start of second sub list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 6;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   P **strong** okay
        This is a paragraphsub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 7, offset: 18 });
    expect(range.end).toEqual({ block: 7, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly in middle of second sub list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 6;
    range.start.offset = 10;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list elP **strong** okay
        This is a paragraphement two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 7, offset: 18 });
    expect(range.end).toEqual({ block: 7, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at end of second sub list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 6;
    range.start.offset = 19;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element twoP **strong** okay
        This is a paragraph

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 7, offset: 18 });
    expect(range.end).toEqual({ block: 7, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at start of last paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 7;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

P **strong** okay

This is a paragraphAnother paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 8, offset: 18 });
    expect(range.end).toEqual({ block: 8, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly in middle of last paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 7;
    range.start.offset = 5;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

AnotheP **strong** okay

This is a paragraphr paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 8, offset: 18 });
    expect(range.end).toEqual({ block: 8, offset: 18 });
  });

  it("should copy and paste multiple paragraphs properly at end of last paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 7;
    range.start.offset = 16;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraphP **strong** okay

This is a paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 8, offset: 18 });
    expect(range.end).toEqual({ block: 8, offset: 18 });
  });

  it("should copy and paste the list properly at end of heading", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 0;
    range.start.offset = 5;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Headerlist element one

-   list element two
    -   sub list element
    -   sub list element two

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 3, offset: 19 });
    expect(range.end).toEqual({ block: 3, offset: 19 });
  });

  it("should copy and paste the list properly in the middle of heading", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 0;
    range.start.offset = 3;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Headlist element one

-   list element two
    -   sub list element
    -   sub list element twoer

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 3, offset: 19 });
    expect(range.end).toEqual({ block: 3, offset: 19 });
  });

  it("should copy and paste the list properly at start of heading", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 0;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
-   list element one
-   list element two
    -   sub list element
    -   sub list element twoHeader

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 3, offset: 19 });
    expect(range.end).toEqual({ block: 3, offset: 19 });
  });

  it("should copy and paste the list properly at start of paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 1;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

-   list element one
-   list element two
    -   sub list element
    -   sub list element twoP **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 4, offset: 19 });
    expect(range.end).toEqual({ block: 4, offset: 19 });
  });

  it("should copy and paste the list properly at start of strong in paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 1;
    range.start.offset = 1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P list element one

-   list element two
    -   sub list element
    -   sub list element two**strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 4, offset: 19 });
    expect(range.end).toEqual({ block: 4, offset: 19 });
  });

  it("should copy and paste the list properly in middle of strong in paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 1;
    range.start.offset = 3;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **st**list element one

-   list element two
    -   sub list element
    -   sub list element two**rong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 4, offset: 19 });
    expect(range.end).toEqual({ block: 4, offset: 19 });
  });

  it("should copy and paste the list properly at end of strong in paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 1;
    range.start.offset = 7;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong**list element one

-   list element two
    -   sub list element
    -   sub list element two okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 4, offset: 19 });
    expect(range.end).toEqual({ block: 4, offset: 19 });
  });

  it("should copy and paste the list properly at end of paragraph", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 1;
    range.start.offset = 12;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okaylist element one

-   list element two
    -   sub list element
    -   sub list element two

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 4, offset: 19 });
    expect(range.end).toEqual({ block: 4, offset: 19 });
  });

  it("should copy and paste the list properly at start of first list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 3;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element twolist element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: 19 });
    expect(range.end).toEqual({ block: 6, offset: 19 });
  });

  it("should copy and paste the list properly in middle of first list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 3;
    range.start.offset = 5;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list elist element one
    -   list element two
        -   sub list element
        -   sub list element twolement one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: 19 });
    expect(range.end).toEqual({ block: 6, offset: 19 });
  });

  it("should copy and paste the list properly at end of first list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 3;
    range.start.offset = 15;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element onelist element one
    -   list element two
        -   sub list element
        -   sub list element two
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: 19 });
    expect(range.end).toEqual({ block: 6, offset: 19 });
  });

  it("should copy and paste the list properly at start of second list item", () => {
    let range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    range.start.block = 4;
    range.start.offset = -1;
    range.end = { ...range.start };

    // @ts-ignore
    document.pasteFromClipboard(copiedDoc, range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element one
-   list element two
    -   sub list element
    -   sub list element twolist element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 7, offset: 19 });
    expect(range.end).toEqual({ block: 7, offset: 19 });
  });
});
