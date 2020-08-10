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

  it("should insert letter at start of header", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# kHeader

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

  it("should insert letter in middle of header", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 0,
        offset: 3,
      },
      end: {
        block: 0,
        offset: 3,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Headker

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

  it("should insert letter at end of header", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Headerk

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

  it("should insert letter at start of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: -1,
      },
      end: {
        block: 1,
        offset: -1,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

kP **strong** okay

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

  it("should insert letter at middle of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 11,
      },
      end: {
        block: 1,
        offset: 11,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okaky

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

  it("should insert letter at end of paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 12,
      },
      end: {
        block: 1,
        offset: 12,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okayk

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

  it("should insert letter right before strong", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P k**strong** okay

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

  it("should insert letter in middle of strong", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 3,
      },
      end: {
        block: 1,
        offset: 3,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **stkrong** okay

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

  it("should insert letter at end of strong", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strongk** okay

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

  it("should insert letter right after strong", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 8,
      },
      end: {
        block: 1,
        offset: 8,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** kokay

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

  it("should insert letter at front of list", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   klist element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter in middle of first listitem", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: 6,
      },
      end: {
        block: 3,
        offset: 6,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list elkement one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at end of first listitem", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element onek
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at start of second listitem", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 4,
        offset: -1,
      },
      end: {
        block: 4,
        offset: -1,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   klist element two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at middle of second listitem", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list elekment two
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at end of second listitem", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element twok
    -   sub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at start of first sub listitem", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   ksub list element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at middle of first sub listitem", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 5,
        offset: 4,
      },
      end: {
        block: 5,
        offset: 4,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub lkist element
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at end of first sub listitem", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list elementk
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at start of second sub listitem", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 6,
        offset: -1,
      },
      end: {
        block: 6,
        offset: -1,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   ksub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at middle of second sub listitem", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 6,
        offset: 4,
      },
      end: {
        block: 6,
        offset: 4,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub lkist element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at start of second sub listitem", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element twok

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at start of last paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 7,
        offset: -1,
      },
      end: {
        block: 7,
        offset: -1,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

kAnother paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at middle of last paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 7,
        offset: 4,
      },
      end: {
        block: 7,
        offset: 4,
      },
    };

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Anothker paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should insert letter at end of last paragraph", () => {
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

    document.insertLetter(range, "k");

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraphk
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });
});
