import { clearSelection, selectAll as selectAllTargets } from "../handler";
import * as vscode from 'vscode';
// export function clear(){
//     let selection = selectAllTargets();
//     if( selection.isSet){
//         vscode.commands.executeCommand("editor.action.clipboardCopyAction");
//     }
//     selection.reset();
//     vscode.commands.executeCommand("editor.action.clipboardPasteAction");
//     clearSelection();
// }

// export async  function bring(){
//     let selection = selectAllTargets();
//     if( selection.isSet){
//        await vscode.commands.executeCommand("editor.action.clipboardCutAction");
//     }
//     selection.reset();
// }

let tested_actions = [
    "editor.action.clipboardCutAction",
    "editor.action.clipboardPasteAction",
    "editor.action.clipboardCopyAction"
];


export async function selectActionReset(action:string){
    let selection = selectAllTargets();
    if( selection.isSet){
       await vscode.commands.executeCommand(action);
    }
    selection.reset();
    clearSelection();
}


export async function selectAction(action:string){
    let selection = selectAllTargets();
    if( selection.isSet){
       await vscode.commands.executeCommand(action);
    }
    clearSelection();
}

export async function selectActionResetAction(actions:string[]){
    let selection = selectAllTargets();
    if( selection.isSet){
       await vscode.commands.executeCommand(actions[0]);
    }
    selection.reset();
    await vscode.commands.executeCommand(actions[1]);
    clearSelection();
}

