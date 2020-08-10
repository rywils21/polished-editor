import { DocumentRoot } from "types/appTypes";
import { markdownProcessor } from "../../hooks/useData";
import {
  createDocumentRoot,
  loadDocumentFromMarkdown,
  stringifyDocumentRoot,
} from "../../actions/creatorAppElements";
import { SelectionRange } from "../../types/index";

describe("document copy", () => {
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

  it("should copy nothing at start", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: -1,
      },
      end: {
        block: 0,
        offset: -1,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = ``;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the first letter of header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: -1,
      },
      end: {
        block: 0,
        offset: 0,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# H
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the first five letters of header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: -1,
      },
      end: {
        block: 0,
        offset: 4,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# Heade
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the last five letters of header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 0,
      },
      end: {
        block: 0,
        offset: 5,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# eader
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the middle letters of header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 0,
      },
      end: {
        block: 0,
        offset: 4,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# eade
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy all of header and some of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: -1,
      },
      end: {
        block: 1,
        offset: 0,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# Header

P
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and some of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 1,
        offset: 0,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and some of paragraph including strong", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 1,
        offset: 3,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P **st**
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and some of paragraph including all of strong", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 1,
        offset: 7,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P **strong**
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and most of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 1,
        offset: 10,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P **strong** ok
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and all of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 1,
        offset: 12,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P **strong** okay
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and all of paragraph and none of the next", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 2,
        offset: -1,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P **strong** okay
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of header and all of paragraph and all of the next", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
# er

P **strong** okay

This is a paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and none of the list item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 3,
        offset: -1,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and some of the list item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 3,
        offset: 3,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and all of the list item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 3,
        offset: 15,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and all of the list item and some of the next", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 4,
        offset: 10,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list elemen
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and all of the list item and some of the sublist item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 5,
        offset: 2,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and all of the list item and all of the sublist item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 5,
        offset: 15,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub list element
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and some of the second sublist item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 6,
        offset: 2,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub list element
    -   sub
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and all of the second sublist item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and none of the final paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 7,
        offset: -1,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and some of the final paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 7,
        offset: 6,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of paragraph and all of the final paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 10,
      },
      end: {
        block: 7,
        offset: 16,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
aragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the entire document", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: -1,
      },
      end: {
        block: 7,
        offset: 16,
      },
    };

    const copiedDoc = document.copyRange(range);

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
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the entire list", () => {
    const range: SelectionRange = {
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

    const expectedResult = `
-   list element one
-   list element two
    -   sub list element
    -   sub list element two
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of first list item and rest of list", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: 4,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
-   element one
-   list element two
    -   sub list element
    -   sub list element two
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy second list item and rest of list", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 4,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
-   list element two
    -   sub list element
    -   sub list element two
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the sub list", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 5,
        offset: -1,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
-   sub list element
-   sub list element two
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy the sub list and some of the final paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 5,
        offset: -1,
      },
      end: {
        block: 7,
        offset: 6,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
-   sub list element
-   sub list element two

Another
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should copy some of the sub list and some of the final paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 6,
        offset: 4,
      },
      end: {
        block: 7,
        offset: 6,
      },
    };

    const copiedDoc = document.copyRange(range);

    const expectedResult = `
-   ist element two

Another
    `;

    // @ts-ignore
    const result = stringifyDocumentRoot(copiedDoc);

    expect(result.trim()).toEqual(expectedResult.trim());
  });
});
