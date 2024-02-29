import { UserTarget, getTargets, setRange } from "../handler";
import * as vscode from 'vscode';
import { PositionMath } from "../utils/ExtendedPos";
import { insideAny } from "./inside";




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
        case "goToNextToken":
            byToken("next","replace");
            break;
        case "goToPrevToken":
            byToken("prev","replace");
            break;
        case "insideAny":
            insideAny();
            break;

        default:
            vscode.window.showErrorMessage(`Modifier ${modifier} not supported`);
            break;
    }
}

function byToken(
    dir: "prev" | "next",
    mode: "cursor" | "replace" = "cursor"
) {


    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let cursorPos = element.range.end;
        if (element.cursorPosition === "start") {
            cursorPos = element.range.start;
        }

        const lineText = element.editor.document.lineAt(cursorPos.line).text;
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
                new vscode.Position(cursorPos.line, cursorPos.character + match.index),
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
            const lastCharInLine = element.editor.document.lineAt(cursorPos.line).range.end.character;
            newRange = new vscode.Range(
                new vscode.Position(cursorPos.line - 1, lastCharInLine),
                new vscode.Position(cursorPos.line - 1, lastCharInLine)
            );
        }

        if (mode === "cursor") {
            if (element.cursorPosition === "end") {
                newRange = new vscode.Range(
                    element.range.start,
                    newRange.end
                );
                newTargets.push(new UserTarget(element.editor, newRange, element.anchor, element.cursorPosition));
            } else {
                newRange = new vscode.Range(
                    newRange.start,
                    element.range.end,
                );
                newTargets.push(new UserTarget(element.editor, newRange, element.anchor, element.cursorPosition));
            }
        } else if (mode === "replace") {
            newTargets.push(new UserTarget(element.editor, newRange, newRange.end, element.cursorPosition));
        }
    }
    setRange(newTargets, "replace");
}

function home() {
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let line = element.range.end.line;
        if (element.cursorPosition === "start") {
            line = element.range.start.line;
        }

        let startOfLine = element.editor.document.lineAt(line).range.start;
        let lineTxt = element.editor.document.lineAt(line).text;
        const match = lineTxt.match(/\S/);

        if (match && match.index && match.index !== element.range.end.character) {
            startOfLine = new vscode.Position(startOfLine.line, match.index);
        }

        let range = new vscode.Range(
            element.range.start,
            startOfLine
        );

        if (element.cursorPosition === "start") {
            range = new vscode.Range(
                startOfLine,
                element.range.end
            );
        }
        newTargets.push(new UserTarget(element.editor, range, element.anchor, element.cursorPosition));
    }
    setRange(newTargets, "replace");
}

function end() {
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let line = element.range.end.line;
        if (element.cursorPosition === "start") {
            line = element.range.start.line;
        }
        let end = element.editor.document.lineAt(line).range.end;
        let range = new vscode.Range(element.range.start, end);
        if (element.cursorPosition === "start") {
            range = new vscode.Range(
                end,
                element.range.end
            );
        }
        newTargets.push(new UserTarget(element.editor, range, element.anchor, element.cursorPosition));
    }
    setRange(newTargets, "replace");

}

function verticalMove(dir: "up" | "down") {
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let cursorPos = element.range.end;
        if (element.cursorPosition === "start") {
            cursorPos = element.range.start;
        }

        let nextPos = new vscode.Position(cursorPos.line + 1, cursorPos.character);
        if (dir === "up") {
            nextPos = new vscode.Position(cursorPos.line - 1, cursorPos.character);
        }

        if (new PositionMath(element.range.start).greaterThan(new PositionMath(nextPos))) {
            let range = new vscode.Range(
                nextPos,
                element.anchor,
            );
            newTargets.push(new UserTarget(element.editor, range, element.anchor, "start"));
        } else {
            let range = new vscode.Range(
                element.anchor,
                nextPos
            );
            newTargets.push(new UserTarget(element.editor, range, element.anchor, "end"));
        }

    }
    setRange(newTargets, "replace");

}