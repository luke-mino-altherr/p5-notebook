// LOVE LETTERS, after Christopher Strachey (1952)
// How it works in plain English, and the prompts that built it: see recipe.md
// (click Recipe in the sketch's toolbar).

// Word lists. The computer picks one word at random from a list each time it needs one.
// Our own words, in the spirit of the original. Add your own!
const GREETINGS = ['DEAR', 'DARLING', 'PRECIOUS', 'BELOVED', 'SWEET', 'TENDER'];
const PET_NAMES = ['HEART', 'TREASURE', 'DOVE', 'STAR', 'LOVE', 'MOONBEAM'];
const ADJECTIVES = [
  'ARDENT', 'WISTFUL', 'TENDER', 'RESTLESS', 'LUMINOUS', 'BREATHLESS',
  'CURIOUS', 'GENTLE', 'HUNGRY', 'SECRET', 'TREMBLING', 'DEVOTED',
];
const NOUNS = [
  'LONGING', 'DEVOTION', 'FANCY', 'YEARNING', 'HEARTBEAT', 'WHISPER',
  'AFFECTION', 'DESIRE', 'SIGH', 'ADMIRATION', 'HUNGER', 'DAYDREAM',
];
const ADVERBS = ['QUIETLY', 'ENDLESSLY', 'FONDLY', 'HELPLESSLY', 'SOFTLY', 'TRULY', 'WILDLY'];
const VERBS = ['HOLDS', 'TREASURES', 'AWAITS', 'CHERISHES', 'SEEKS', 'ADORES', 'LONGS FOR'];

const TYPING_SPEED = 1.5; // letters typed per frame
const PAUSE = 5000;       // milliseconds to rest on a finished letter

let lines = [];  // the letter, split into lines of words
let typed = 0;   // how many characters have been typed so far
let total = 0;
let finishedAt = null;
let fontSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace'); // the browser's typewriter-style font
  newLetter();
}

// ---- writing the letter ------------------------------------------------------

// A word chosen at random is marked as a "slot", so we can colour it differently.
const pick = (list) => ({ text: random(list), slot: true });
const fixed = (text) => text.split(' ').map((word) => ({ text: word, slot: false }));

// Sentence templates: fixed words with blanks filled from the lists.
// Returns a list of words; the last word gets a full stop.
function sentence() {
  const words = random([
    () => [...fixed('YOU ARE MY'), pick(ADJECTIVES), pick(NOUNS)],
    () => [...fixed('MY'), pick(ADJECTIVES), pick(NOUNS), pick(ADVERBS), pick(VERBS), ...fixed('YOUR'), pick(ADJECTIVES), pick(NOUNS)],
    () => [...fixed('MY'), pick(NOUNS), pick(VERBS), ...fixed('YOUR'), pick(NOUNS)],
    () => [...fixed('I AM'), pick(ADVERBS), ...fixed('YOUR'), pick(ADJECTIVES), pick(NOUNS)],
  ])();
  const last = words[words.length - 1];
  words[words.length - 1] = { ...last, text: last.text + '.' };
  return words;
}

function newLetter() {
  const body = [];
  const sentences = floor(random(3, 6));
  for (let i = 0; i < sentences; i++) body.push(...sentence());

  const paragraphs = [
    [pick(GREETINGS), pick(PET_NAMES)],
    body,
    [...fixed('YOURS'), pick(ADVERBS)],
    fixed('M.U.C.'),
  ];
  layout(paragraphs);
  typed = 0;
  finishedAt = null;
}

// Wrap the paragraphs into lines that fit the page, with a blank line between paragraphs.
function layout(paragraphs) {
  fontSize = constrain(width / 36, 14, 24);
  textSize(fontSize);
  const maxWidth = min(width - 48, fontSize * 32);

  lines = [];
  for (const paragraph of paragraphs) {
    let line = [];
    for (const word of paragraph) {
      const candidate = [...line, word].map((w) => w.text).join(' ');
      if (line.length && textWidth(candidate) > maxWidth) {
        lines.push(line);
        line = [];
      }
      line.push(word);
    }
    lines.push(line, []);
  }
  total = lines.flat().reduce((sum, word) => sum + word.text.length + 1, 0);
}

// ---- drawing -----------------------------------------------------------------

function draw() {
  background(244, 238, 222);
  textSize(fontSize);
  textAlign(LEFT, TOP);
  noStroke();

  const lineHeight = fontSize * 1.6;
  const blockWidth = min(width - 48, fontSize * 32);
  const left = (width - blockWidth) / 2;
  let y = max(24, (height - lines.length * lineHeight) / 2);

  // Type the letter out one character at a time, like a teleprinter.
  let remaining = floor(typed);
  let cursor = { x: left, y };
  for (const line of lines) {
    let x = left;
    for (const word of line) {
      if (remaining <= 0) break;
      const visible = word.text.slice(0, remaining);
      fill(word.slot ? color(178, 34, 52) : color(40, 36, 32)); // random words in red
      text(visible, x, y);
      x += textWidth(visible + ' ');
      cursor = { x: x - textWidth(' '), y };
      remaining -= word.text.length + 1;
    }
    y += lineHeight;
  }

  // Blinking cursor.
  if (frameCount % 40 < 20) {
    fill(40, 36, 32);
    rect(cursor.x + 2, cursor.y, fontSize * 0.55, fontSize);
  }

  // A small key, so viewers can see which words came from the lists.
  fill(178, 34, 52, 160);
  textSize(fontSize * 0.6);
  textAlign(CENTER, BOTTOM);
  text('RED WORDS WERE CHOSEN AT RANDOM FROM WORD LISTS', width / 2, height - 16);

  typed = min(typed + TYPING_SPEED, total);
  if (typed >= total) {
    finishedAt = finishedAt ?? millis();
    if (millis() - finishedAt > PAUSE) newLetter();
  }
}

function mousePressed() {
  newLetter();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  newLetter();
}
