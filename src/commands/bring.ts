import { clearSelection, selectAll as selectAllTargets } from "../handler";
import * as vscode from 'vscode';
export function clear(){
    let selection = selectAllTargets();
    if( selection.isSet){
        vscode.commands.executeCommand("editor.action.clipboardCopyAction");
    }
    selection.reset();
    vscode.commands.executeCommand("editor.action.clipboardPasteAction");
    clearSelection();
}

export async  function bring(){
    let selection = selectAllTargets();
    if( selection.isSet){
       await vscode.commands.executeCommand("editor.action.clipboardCutAction");
    }
    selection.reset();
}