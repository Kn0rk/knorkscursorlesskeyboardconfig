import { Decoration, Hat } from "./hats/createDecorations";
import * as vscode from 'vscode';
import { highlight } from "./highlight";
import { ReadVResult } from "fs";

let deco_map: {[key: string]: any}= new Map();
export function setHat(deco :Decoration, hat: Hat){
    deco_map.set(decoToString(deco),hat);
}

export function clearAllHats(){
    deco_map={};
}

export function getHat(deco:Decoration):Hat{
    let deco_string = decoToString(deco);
    if (!deco_map.has(deco_string)){
        vscode.window.showInformationMessage(`${deco_string} not in map.`);
    }
    return deco_map.get(deco_string);
}

function decoToString(deco:Decoration):string{
    return `${deco.style}:${deco.character}`;
}

let g_starPos:vscode.Position|undefined = undefined;
let g_endPos:vscode.Position|undefined = undefined;

export function setRange(startPos:vscode.Position,endPos:vscode.Position, editor: vscode.TextEditor){

    if (!editor){
        return;
    }
    g_starPos = g_starPos ?? startPos; 
    g_endPos = g_endPos ?? endPos;
    if (startPos.line < g_starPos.line || (startPos.line === g_starPos.line && startPos.character< g_starPos.character)){
        g_starPos = startPos;
    }

    if (endPos.line > g_endPos.line || (endPos.line === g_endPos.line && endPos.character> g_endPos.character)) {
        g_endPos = endPos;
    }


    highlight(editor,g_starPos,g_endPos);
    
}