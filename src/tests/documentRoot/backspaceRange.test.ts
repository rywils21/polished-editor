import { DocumentRoot } from "types/appTypes";
import { markdownProcessor } from "../../hooks/useData";
import {
  createDocumentRoot,
  loadDocumentFromMarkdown,
  stringifyDocumentRoot,
} from "../../actions/creatorAppElements";
import { SelectionRange } from "../../types/index";

describe("document insert letter", () => {
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

  it("should delete a range within header", () => {
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

    document.backspace(range);

    const expectedResult = `
# Hr

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
  });

  it("should delete all text of header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: -1,
      },
      end: {
        block: 0,
        offset: 5,
      },
    };

    document.backspace(range);

    const expectedResult = `
# 

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
  });

  it("should delete a range within paragraph deleting strong element", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 0,
      },
      end: {
        block: 1,
        offset: 10,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

Pay

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
  });

  it("should delete first half of strong in paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 0,
      },
      end: {
        block: 1,
        offset: 4,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P**ong** okay

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
  });

  it("should delete second half of strong in paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 4,
      },
      end: {
        block: 1,
        offset: 9,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **str**kay

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
  });

  it("should delete entire contents of paragraph", () => {
    const range: SelectionRange = {
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

    document.backspace(range);

    const expectedResult = `
# Header



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
  });

  it("should delete a range across header and paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 2,
      },
      end: {
        block: 1,
        offset: 9,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Heakay

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
  });

  it("should delete a range across header and two paragraphs", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 2,
      },
      end: {
        block: 2,
        offset: 4,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Heais a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should delete entire paragraph when end is at it's end", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 2,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Hea

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should delete a range but keep whole paragraph when start is at it's start", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 2,
      },
      end: {
        block: 2,
        offset: -1,
      },
    };

    document.backspace(range);

    const expectedResult = `
# HeaThis is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should delete first list element into paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 15,
      },
      end: {
        block: 3,
        offset: 4,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragrelement one

-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should delete entire first list element when end is at it's end", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 8,
      },
      end: {
        block: 3,
        offset: 15,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a

-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should delete entire paragraph and first list item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: -1,
      },
      end: {
        block: 3,
        offset: 15,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay



-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });
});
