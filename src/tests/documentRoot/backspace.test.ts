import { DocumentRoot } from "types/appTypes";
import { markdownProcessor } from "../../hooks/useData";
import {
  createDocumentRoot,
  loadDocumentFromMarkdown,
  stringifyDocumentRoot,
} from "../../actions/creatorAppElements";
import { SelectionRange } from "../../types/index";

describe("document backspace", () => {
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

  it("should do nothing at start of header", () => {
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

    document.backspace(range);

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

  it("should delete a single letter in middle of header", () => {
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

    document.backspace(range);

    const expectedResult = `
# Heder

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

  it("should delete last letter of header", () => {
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

    document.backspace(range);

    const expectedResult = `
# Heade

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

  it("should backspace contents into header from start of paragraph", () => {
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

    document.backspace(range);

    const expectedResult = `
# HeaderP **strong** okay

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
    expect(range.start).toEqual({ block: 0, offset: 5 });
    expect(range.end).toEqual({ block: 0, offset: 5 });
  });

  it("should backspace first letter of first paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 0,
      },
      end: {
        block: 1,
        offset: 0,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

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

  it("should backspace text right before strong", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P**strong** okay

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

  it("should backspace first letter of strong", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 1,
        offset: 2,
      },
      end: {
        block: 1,
        offset: 2,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **trong** okay

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

  it("should backspace middle letter of strong", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **stong** okay

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

  it("should backspace last letter of strong", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **stron** okay

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

  it("should backspace first letter after strong", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong**okay

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

  it("should backspace last letter of last paragraph", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** oka

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

  it("should back contents of second paragraph up to first", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okayThis is a paragraph

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

  it("should back first list item into it's own paragraph", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

list element one

-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace middle of first listitem", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 3,
        offset: 3,
      },
      end: {
        block: 3,
        offset: 3,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   lis element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace last letter of first listitem", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element on
-   list element two
    -   sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should back contents of second listitem out to child of first", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
    list element two
    -   sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace middle of second list item", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 4,
        offset: 3,
      },
      end: {
        block: 4,
        offset: 3,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   lis element two
    -   sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace last letter of second list item", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element tw
    -   sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should back contents of first sublist item out into second paragraph of second list item", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    sub list element
    -   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("(double back) should back contents of first sublist item out to root and split list", () => {
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

    document.backspace(range);
    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two

sub list element

-   sub list element two

Another paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace last letter of first sublistitem", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list elemen
    -   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should back out second sublist item into first sublist item", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
        sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("(double back) should back out second sublist item to parent list item", () => {
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

    document.backspace(range);
    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("(triple back) should back out second sublist item to root", () => {
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

    document.backspace(range);
    document.backspace(range);
    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element

sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should back last paragraph onto last sublistitem", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element twoAnother paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace middle of last paragraph", () => {
    const range: SelectionRange = {
      documentIndex: 0,
      start: {
        block: 7,
        offset: 5,
      },
      end: {
        block: 7,
        offset: 5,
      },
    };

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Anothr paragraph
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace last letter of last paragraph", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -   sub list element two

Another paragrap
  `;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("should backspace an entire list item properly", () => {
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

    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);
    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
-   list element two
    -   sub list element
    -

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });
});

describe("document backspace", () => {
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

  it("should pull second list item up to first list item", () => {
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

    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one
    list element two
-   sub list element
-   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });

  it("(double back) should pull second list item out to root and split list", () => {
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

    document.backspace(range);
    document.backspace(range);

    const expectedResult = `
# Header

P **strong** okay

This is a paragraph

-   list element one

list element two

-   sub list element
-   sub list element two

Another paragraph
`;

    // @ts-ignore
    const result = stringifyDocumentRoot(document);

    expect(result.trim()).toEqual(expectedResult.trim());
  });
});
