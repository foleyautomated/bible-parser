#!/usr/bin/env node
console.log("Hello from my TypeScript CLI!");

interface BibleBook {
    name: string;
    abbreviation: string;
    chapters: { [chapter: number]: number };
}

function parseBibleText(bibleText: string): BibleBook[] {
    const books: BibleBook[] = [];
    const lines = bibleText.split('\n');
    let currentBook: BibleBook | null = null;
    let currentChapter = 0;

    lines.forEach(line => {
        const [reference, verseText] = line.split('\t');
        const [bookName, chapterVerse] = reference.split(' ');
        const [chapter, verse] = chapterVerse.split(':').map(Number);

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

import * as fs from 'fs';

const bibleText = fs.readFileSync('./data/asv.txt', 'utf8');

const biblejson = parseBibleText(bibleText);

fs.writeFileSync('bible.json', JSON.stringify(biblejson, null, 2), 'utf8');