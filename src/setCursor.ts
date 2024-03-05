import * as vscode from "vscode";

let style:vscode.TextEditorCursorStyle;
let init:boolean=false;


function internalSetCursorStyle(){
    if (! vscode.window.activeTextEditor){
        return;
    }
    vscode.window.activeTextEditor.options.cursorStyle = style;
}

export function setCursorStyle(newStyle : vscode.TextEditorCursorStyle){
    style=newStyle;

    if (!init){
        vscode.window.onDidChangeActiveTextEditor((textEditor) =>{
            if (!textEditor){
                return;
            }
            internalSetCursorStyle();
        }
        );
        init=true;
    }
    internalSetCursorStyle();
}