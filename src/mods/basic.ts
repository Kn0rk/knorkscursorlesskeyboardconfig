import { UserTarget, getTargets, setRange } from "../handler";
import * as vscode from 'vscode';
import { PositionMath } from "../utils/ExtendedPos";




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

        default:
            vscode.window.showErrorMessage(`$modifier in not supported`);
            break;
    }
}

function home(){
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let line = element.range.end.line;
        if (element.cursorPosition === "start"){
            line = element.range.start.line;
        }

        let startOfLine = element.editor.document.lineAt(line).range.start;
        let lineTxt = element.editor.document.lineAt(line).text;
        const match = lineTxt.match(/\S/);

        if (match && match.index && match.index !==  element.range.end.character){
            startOfLine = new vscode.Position(startOfLine.line,match.index);
        }
        
        let range = new vscode.Range(
            element.range.start,
            startOfLine
        );

        if (element.cursorPosition === "start"){
            range= new vscode.Range(
                startOfLine,
                element.range.end
            );
        }
        newTargets.push(new UserTarget(element.editor, range,element.anchor,element.cursorPosition));
    }
    setRange(newTargets, "replace");   
}

function end() {
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let line = element.range.end.line;
        if (element.cursorPosition === "start"){
            line = element.range.start.line;
        }
        let end = element.editor.document.lineAt(line).range.end;
        let range = new vscode.Range(element.range.start, end);
        if (element.cursorPosition === "start"){
            range= new vscode.Range(
                end,
                element.range.end
            );
        }
        newTargets.push(new UserTarget(element.editor, range,element.anchor,element.cursorPosition));
    }
    setRange(newTargets, "replace");

}

function verticalMove(dir: "up" | "down") {
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let cursorPos = element.range.end;
        if (element.cursorPosition === "start")
        {
            cursorPos= element.range.start;
        }

        let nextPos = new vscode.Position(cursorPos.line+1,cursorPos.character);
        if (dir === "up") {
            nextPos = new vscode.Position(cursorPos.line-1,cursorPos.character);
        }
        
        if (new PositionMath(element.range.start).greaterThan( new PositionMath(nextPos))) {
            let range = new vscode.Range(
                nextPos,
                element.anchor,
            );
            newTargets.push(new UserTarget(element.editor, range,element.anchor, "start"));
        } else {
            let range = new vscode.Range(
                element.anchor,
                nextPos
            );
            newTargets.push(new UserTarget(element.editor, range, element.anchor,"end"));
        }

    }
    setRange(newTargets, "replace");

}