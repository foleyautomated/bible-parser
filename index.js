#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Hello from my TypeScript CLI!");
function removeDuplicateObjects(jsonArray, key) {
    var uniqueObjects = new Map();
    return jsonArray.filter(function (obj) {
        var keyValue = obj[key];
        if (!uniqueObjects.has(keyValue)) {
            uniqueObjects.set(keyValue, true);
            return true;
        }
        return false;
    });
}
function parseBibleText(bibleText) {
    var books = [];
    var lines = bibleText.split('\n');
    var prevBookName = "Genesis";
    var prevChapterNumber;
    var currTestament = "OT";
    lines.forEach(function (line, index) {
        var _a;
        var chapter;
        var verse;
        var bookName;
        ;
        var content;
        var lineSegments = line.split(/\s/);
        //Get Book Name (Handle '1 Samuel', '3 John', etc)
        if (line.startsWith('1') || line.startsWith('2') || line.startsWith('3')) {
            bookName = "".concat(lineSegments[0], " ").concat(lineSegments[1]);
            lineSegments = lineSegments.slice(2);
        }
        else {
            bookName = lineSegments[0].trim();
            lineSegments = lineSegments.slice(1);
        }
        //Get Chapter and Verse Numbers
        _a = line.match(/\d+:\d+/)[0].split(":").map(function (val) { return parseInt(val.trim()); }), chapter = _a[0], verse = _a[1];
        if (bookName == "Matthew") {
            currTestament = "NT";
        }
        //console.log(`${bookName} ${chapter}>>${verse} ${content}`)
        //console.log(currentBibleBook.chapters + "----" + chapter);
        if (prevChapterNumber < chapter || prevChapterNumber == undefined) {
            prevChapterNumber = chapter;
        }
        else if (chapter < prevChapterNumber && prevBookName != bookName || index == lines.length - 1) {
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
var fs = require("fs");
var bibleText = fs.readFileSync('./data/asv.txt', 'utf8');
var abbreviations = JSON.parse(fs.readFileSync('./data/abbreviations.json', 'utf8'));
var genres = JSON.parse(fs.readFileSync('./data/genres.json', 'utf8'));
var biblejson = parseBibleText(bibleText);
fs.writeFileSync('bibleMetadata.json', JSON.stringify(biblejson, null, 2), 'utf8');
