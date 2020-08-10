import { DocumentRoot } from "types/appTypes";
import { markdownProcessor } from "../../hooks/useData";
import {
  createDocumentRoot,
  loadDocumentFromMarkdown,
  stringifyDocumentRoot,
} from "../../actions/creatorAppElements";
import { SelectionRange } from "../../types/index";

describe("document carriage return", () => {
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

  it("should add empty new paragraph after header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 5,
      },
      end: {
        block: 0,
        offset: 5,
      },
    };

    document.carriageReturn(range);
    document.insertLetter(range, "k");

    const expectedResult = `
# Header

k

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

  it("should clone rest of block to next line from header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 2,
      },
      end: {
        block: 0,
        offset: 2,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Hea

der

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

  it("should move all text from header at the beginning", () => {
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

    document.carriageReturn(range);

    const expectedResult = `
# 

Header

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

  it("should add new paragraph after paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 18,
      },
      end: {
        block: 2,
        offset: 18,
      },
    };

    document.carriageReturn(range);
    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

k

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

  it("should clone rest of block to next line from paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: 13,
      },
      end: {
        block: 2,
        offset: 13,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a para

graph

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

  it("should move all text from header at the beginning", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 2,
        offset: -1,
      },
      end: {
        block: 2,
        offset: -1,
      },
    };

    document.carriageReturn(range);

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
  });

  it("should split the strong text between the two paragaraphs", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 4,
      },
      end: {
        block: 1,
        offset: 4,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **str**

**ong** okay

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

  it("should start a new line with a strong element", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 7,
      },
      end: {
        block: 1,
        offset: 7,
      },
    };

    document.carriageReturn(range);
    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong**

**k** okay

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

  it("should move strong element to the next paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 1,
      },
      end: {
        block: 1,
        offset: 1,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P 

**strong** okay

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

  it("should add a new list item after the first list item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: 15,
      },
      end: {
        block: 3,
        offset: 15,
      },
    };

    document.carriageReturn(range);
    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   k
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should should copy content from first list item into new one", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: 7,
      },
      end: {
        block: 3,
        offset: 7,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list ele
-   ment one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should should copy all content from first list item into new one", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: -1,
      },
      end: {
        block: 3,
        offset: -1,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-
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

  it("should should move subchildren onto new list element", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 4,
        offset: 15,
      },
      end: {
        block: 4,
        offset: 15,
      },
    };

    document.carriageReturn(range);
    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
-   k
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should should move subchildren onto new list element and copy half contents", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 4,
        offset: 7,
      },
      end: {
        block: 4,
        offset: 7,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list ele
-   ment two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should should add new list item in nested list", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 5,
        offset: 15,
      },
      end: {
        block: 5,
        offset: 15,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());

    expect(range.start).toEqual({ block: 6, offset: -1 });
    expect(range.end).toEqual({ block: 6, offset: -1 });
  });

  it("should copy contents into new list item in sublist", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 5,
        offset: 6,
      },
      end: {
        block: 5,
        offset: 6,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub lis
    -   t element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());

    expect(range.start).toEqual({ block: 6, offset: -1 });
    expect(range.end).toEqual({ block: 6, offset: -1 });
  });

  it("should copy all text into new list item when cursor at the start", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 5,
        offset: -1,
      },
      end: {
        block: 5,
        offset: -1,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 6, offset: -1 });
    expect(range.end).toEqual({ block: 6, offset: -1 });
  });

  it("should add list item at the end of the list", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 6,
        offset: 19,
      },
      end: {
        block: 6,
        offset: 19,
      },
    };

    document.carriageReturn(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two
    -

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 7, offset: -1 });
    expect(range.end).toEqual({ block: 7, offset: -1 });
  });

  it("should make new paragraph at the end", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 7,
        offset: 16,
      },
      end: {
        block: 7,
        offset: 16,
      },
    };

    document.carriageReturn(range);
    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph

k
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
    expect(range.start).toEqual({ block: 8, offset: 0 });
    expect(range.end).toEqual({ block: 8, offset: 0 });
  });
});
