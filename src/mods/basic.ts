import { UserTarget, getTargets, setRange } from "../handler";
import * as vscode from 'vscode';




export function modAll(modifier:string){

    switch (modifier) {
        case "end":
            end();            
            break;
    
        default:
            vscode.window.showErrorMessage(`$modifier in not supported`);
            break;
    }
}

export function end(){
    let targets = getTargets();
    let newTargets = [];
    for (let index = 0; index < targets.length; index++) {
        const element = targets[index];
        let line = element.range.end.line;
        let end = element.editor.document.lineAt(line).range.end;
        let range = new vscode.Range(end,end);
        newTargets.push(new UserTarget(element.editor,range));
    }
    setRange(newTargets);

}