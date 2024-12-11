#!/usr/bin/env node
console.log("Extracting Biblical Metadata...");

interface BibleBook {
    name: string;
    testament: string;
    abbreviation: string;
    chapters: number;
    genres: string[];
}

interface BibleChapter {
    number: number;
    verses: { [verse: number]: string };
}

function removeDuplicateObjects(jsonArray: any[], key: string): any[] {
    const uniqueObjects = new Map();
  
    return jsonArray.filter(obj => {
      const keyValue = obj[key];
      if (!uniqueObjects.has(keyValue)) {
        uniqueObjects.set(keyValue, true);
        return true;
      }
      return false;
    });
  }

function parseBibleText(bibleText: string): BibleBook[] {
    const books: BibleBook[] = [];
    const lines = bibleText.split('\n');

    let prevBookName = "Genesis"
    let prevChapterNumber: number;
    let currTestament = "OT"

    lines.forEach((line, index) => {

        let chapter: number;
        let verse: number;
        let bookName: string;;
        let content: string;

        let lineSegments = line.split(/\s/);

        //Get Book Name (Handle '1 Samuel', '3 John', etc)
        if (line.startsWith('1') || line.startsWith('2') || line.startsWith('3')) {
            bookName = `${lineSegments[0]} ${lineSegments[1]}`
            lineSegments = lineSegments.slice(2);
        } else {
            bookName = lineSegments[0].trim();
            lineSegments = lineSegments.slice(1);
        }
        
        //Get Chapter and Verse Numbers
        [chapter, verse] = line.match(/\d+:\d+/)![0].split(":").map(val => parseInt(val.trim()));

        if(bookName == "Matthew") {
            currTestament = "NT"
        }

        //console.log(`${bookName} ${chapter}>>${verse} ${content}`)

        //console.log(currentBibleBook.chapters + "----" + chapter);
        if(prevChapterNumber < chapter || prevChapterNumber == undefined) {
            prevChapterNumber = chapter;
        } else if( chapter < prevChapterNumber && prevBookName != bookName || index == lines.length - 1) {
            books.push({
                name: prevBookName,
                testament: currTestament,
                abbreviation: abbreviations[prevBookName],
                chapters: prevChapterNumber,
                genres: genres[prevBookName]
            }); 
            prevBookName = bookName;
            prevChapterNumber = 0;
        }
    });

    return books;
}

import * as fs from 'fs';

const bibleText = fs.readFileSync('./data/asv.txt', 'utf8');
const abbreviations = JSON.parse(fs.readFileSync('./data/abbreviations.json', 'utf8'));
const genres = JSON.parse(fs.readFileSync('./data/genres.json', 'utf8'));
const biblejson = parseBibleText(bibleText);

fs.writeFileSync('bibleMetadata.json', JSON.stringify(biblejson, null, 2), 'utf8');

