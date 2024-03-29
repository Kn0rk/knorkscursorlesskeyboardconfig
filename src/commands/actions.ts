import * as vscode from 'vscode';
import { clearSelection, selectAll } from '../handler';

let tested_actions = [
    "editor.action.clipboardCutAction",
    "editor.action.clipboardPasteAction",
    "editor.action.clipboardCopyAction"
];


export async function selectActionReset(action:string){
    let selection = selectAll();
    if( selection.isSet){
       await vscode.commands.executeCommand(action);
    }
    selection.reset();
    clearSelection();
}


export async function selectAction(action:string){
    let selection = selectAll();
    if( selection.isSet){
       await vscode.commands.executeCommand(action);
    }
    clearSelection();
}

export async function selectActionResetAction(actions:string[]){
    let selection = selectAll();
    if( selection.isSet){
       await vscode.commands.executeCommand(actions[0]);
    }
    selection.reset();
    await vscode.commands.executeCommand(actions[1]);
    clearSelection();
}

