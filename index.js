#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Hello from my TypeScript CLI!");
function parseBibleText(bibleText) {
    var books = [];
    var lines = bibleText.split('\n');
    var currentBook = null;
    var currentChapter = 0;
    lines.forEach(function (line) {
        var _a = line.split('\t'), reference = _a[0], verseText = _a[1];
        var _b = reference.split(' '), bookName = _b[0], chapterVerse = _b[1];
        var _c = chapterVerse.split(':').map(Number), chapter = _c[0], verse = _c[1];
        if (!currentBook || currentBook.name !== bookName) {
            if (currentBook) {
                books.push(currentBook);
            }
            currentBook = {
                name: bookName,
                abbreviation: bookName.slice(0, 3).toUpperCase(),
                chapters: {}
            };
            currentChapter = chapter;
        }
        if (currentChapter !== chapter) {
            currentChapter = chapter;
        }
        if (!currentBook.chapters[currentChapter]) {
            currentBook.chapters[currentChapter] = 0;
        }
        currentBook.chapters[currentChapter]++;
    });
    if (currentBook) {
        books.push(currentBook);
    }
    return books;
}
var fs = require("fs");
var bibleText = fs.readFileSync('./data/asv.txt', 'utf8');
var biblejson = parseBibleText(bibleText);
fs.writeFileSync('bible.json', JSON.stringify(biblejson, null, 2), 'utf8');
