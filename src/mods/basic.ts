import * as vscode from 'vscode';
import { PositionMath } from "../utils/ExtendedPos";
import { getCursor, moveTempCursor } from '../handler';
import { TempCursor } from '../TempCursor';





export function modAll(modifier: string) {

    switch (modifier) {
        case "end":
            end();
            break;
        case "home":
            home();
            break;
        case "down":
            verticalMove("down");
            break;
        case "up":
            verticalMove("up");
            break;
        case "nextToken":
            byToken("next");
            break;
        case "prevToken":
            byToken("prev");
            break;
        // case "insideAny":
        //     insideAny();
        //     break;

        default:
            vscode.window.showErrorMessage(`Modifier ${modifier} not supported`);
            break;
    }
}

function byToken(
    dir: "prev" | "next"
) {


    let cursor = getCursor();
    if(cursor === null){
        return;
    }
    let cursorPos = cursor.pos;
    let editor = cursor.editor;
    

    const lineText = editor.document.lineAt(cursorPos.line).text;
    let text = lineText.slice(cursorPos.character);
    if (dir === "prev") {
        text = lineText.slice(0, cursorPos.character);
    }
    const pattern = /([^a-zA-Z0-9\s]+[a-zA-Z0-9]*)|([a-zA-Z0-9]+)/g;
    let match;
    let matches = [];
    while ((match = pattern.exec(text)) !== null) { matches.push(match); }

    let newRange = null;
    if (matches.length > 0 && dir === "next") {
        let match = matches[0];
        newRange = new vscode.Range(
            new vscode.Position(cursorPos.line, cursorPos.character + match.index+ match[0].length),
            new vscode.Position(cursorPos.line, cursorPos.character + match.index + match[0].length)
        );
    }
    else if (matches.length === 0 && dir === "next") {
        newRange = new vscode.Range(
            new vscode.Position(cursorPos.line + 1, 0),
            new vscode.Position(cursorPos.line + 1, 0)
        );
    } else if (matches.length > 1 && dir === "prev") {
        let lastMatch = matches[matches.length - 2];
        newRange = new vscode.Range(
            new vscode.Position(cursorPos.line, lastMatch.index),
            new vscode.Position(cursorPos.line, lastMatch.index + lastMatch[0].length)
        );
    } else {
        const lastCharInLine = editor.document.lineAt(cursorPos.line).range.end.character;
        newRange = new vscode.Range(
            new vscode.Position(cursorPos.line - 1, lastCharInLine),
            new vscode.Position(cursorPos.line - 1, lastCharInLine)
        );
    }

    moveTempCursor(new TempCursor(newRange.start,editor));
    
}

function home() {
    let cursor = getCursor();
    if(cursor === null){
        return;
    }
    let cursorPos = cursor.pos;
    let editor = cursor.editor;
    let line = cursorPos.line;

    let startOfLine = editor.document.lineAt(line).range.start;
    let lineTxt = editor.document.lineAt(line).text;
    const match = lineTxt.match(/\S/);

    if (match && match.index && match.index !== cursorPos.character) {
        startOfLine = new vscode.Position(startOfLine.line, match.index);
    }
    moveTempCursor(new TempCursor(startOfLine,editor)); 
}

function end() {
    let cursor = getCursor();
    if(cursor === null){
        return;
    }
    let cursorPos = cursor.pos;
    let editor = cursor.editor;
    
    let line = cursorPos.line;
    let end = editor.document.lineAt(line).range.end;
    moveTempCursor(new TempCursor(end,editor));


}

function verticalMove(dir: "up" | "down") {
    let cursor = getCursor();
    if(cursor === null){
        return;
    }
    let cursorPos = cursor.pos;
    let editor = cursor.editor;
    
    let nextPos = new vscode.Position(cursorPos.line + 1, cursorPos.character);
    if (dir === "up") {
        nextPos = new vscode.Position(cursorPos.line - 1, cursorPos.character);
    }

    moveTempCursor(new TempCursor(nextPos,editor));



}