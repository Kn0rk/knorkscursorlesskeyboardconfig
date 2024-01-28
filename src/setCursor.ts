import * as vscode from "vscode";

let style:vscode.TextEditorCursorStyle;
let init:boolean=false;


function setCursorStyle(){
    if (! vscode.window.activeTextEditor){
        return;
    }
    vscode.window.activeTextEditor.options.cursorStyle = style;
}

export function setCursor(newStyle : vscode.TextEditorCursorStyle){
    style=newStyle;

    if (!init){
        vscode.window.onDidChangeActiveTextEditor((textEditor) =>{
            if (!textEditor){
                return;
            }
            setCursorStyle();
        }
        );
        init=true;
    }
    setCursorStyle();
}