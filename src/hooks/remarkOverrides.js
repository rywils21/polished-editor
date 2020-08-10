function trim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, "");
}

function interrupt(interruptors, tokenizers, ctx, parameters) {
  var length = interruptors.length;
  var index = -1;
  var interruptor;
  var config;

  while (++index < length) {
    interruptor = interruptors[index];
    config = interruptor[1] || {};

    if (
      config.pedantic !== undefined &&
      config.pedantic !== ctx.options.pedantic
    ) {
      continue;
    }

    if (
      config.commonmark !== undefined &&
      config.commonmark !== ctx.options.commonmark
    ) {
      continue;
    }

    if (tokenizers[interruptor[0]].apply(ctx, parameters)) {
      return true;
    }
  }

  return false;
}

var tab = "\t";
var lineFeed = "\n";
var space = " ";

var tabSize = 4;

// Tokenise paragraph.
export function paragraph(eat, value, silent) {
  var self = this;
  var settings = self.options;
  var commonmark = settings.commonmark;
  var tokenizers = self.blockTokenizers;
  var interruptors = self.interruptParagraph;
  var index = value.indexOf(lineFeed);
  var length = value.length;
  var position;
  var subvalue;
  var character;
  var size;
  var now;

  while (index < length) {
    // Eat everything if there’s no following newline.
    if (index === -1) {
      index = length;
      break;
    }

    // Stop if the next character is NEWLINE.
    if (value.charAt(index + 1) === lineFeed) {
      break;
    }

    // In commonmark-mode, following indented lines are part of the paragraph.
    if (commonmark) {
      size = 0;
      position = index + 1;

      while (position < length) {
        character = value.charAt(position);

        if (character === tab) {
          size = tabSize;
          break;
        } else if (character === space) {
          size++;
        } else {
          break;
        }

        position++;
      }

      if (size >= tabSize && character !== lineFeed) {
        index = value.indexOf(lineFeed, index + 1);
        continue;
      }
    }

    subvalue = value.slice(index + 1);

    // Check if the following code contains a possible block.
    if (interrupt(interruptors, tokenizers, self, [eat, subvalue, true])) {
      break;
    }

    position = index;
    index = value.indexOf(lineFeed, index + 1);

    if (index !== -1 && trim(value.slice(position, index)) === "") {
      index = position;
      break;
    }
  }

  subvalue = value.slice(0, index);

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true;
  }

  now = eat.now();
  // This is what we comment out to preserve the whitespace
  // subvalue = trimTrailingLines(subvalue)

  return eat(subvalue)({
    type: "paragraph",
    children: self.tokenizeInline(subvalue, now),
  });
}

// A line containing no characters, or a line containing only spaces (U+0020) or
// tabs (U+0009), is called a blank line.
// See <https://spec.commonmark.org/0.29/#blank-line>.
var reBlankLine = /^[ \t]*(\n|$)/;

// Note that though blank lines play a special role in lists to determine
// whether the list is tight or loose
// (<https://spec.commonmark.org/0.29/#blank-lines>), it’s done by the list
// tokenizer and this blank line tokenizer does not have to be responsible for
// that.
// Therefore, configs such as `blankLine.notInList` do not have to be set here.

export function blankLine(eat, value, silent) {
  var match;
  var subvalue = "";
  var index = 0;
  var length = value.length;

  while (index < length) {
    match = reBlankLine.exec(value.slice(index));

    if (match == null) {
      break;
    }

    index += match[0].length;
    subvalue += match[0];
  }

  if (subvalue === "") {
    return {
      type: "paragraph",
      children: [{ type: "text", value: "k" }],
    };
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true;
  }

  eat(subvalue);
  // ({
  //   type: "paragraph",
  //   children: [{ type: "text", value: "k" }],
  // });
}
