import { Decoration, Hat } from "./hats/createDecorations";
import * as vscode from 'vscode';
import { highlight } from "./highlight";
import { ReadVResult } from "fs";
import { group } from "console";

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

// let g_editor:vscode.TextEditor|undefined = undefined;;
// let g_starPos:vscode.Position|undefined = undefined;
// let g_endPos:vscode.Position|undefined = undefined;

export class UserTarget {
    

    constructor(
        public editor: vscode.TextEditor,
        public range : vscode.Range
    ){}

    union(other:UserTarget ){

        if(this.editor.document.uri !== other.editor.document.uri){
            return;
        }

        let start = this.range.start;
        let end = this.range.end;
        if (other.range.start.line < this.range.start.line || (other.range.start.line === this.range.start.line && other.range.start.character< this.range.start.character)){
            start = other.range.start;
        }

        if (other.range.end.line > this.range.end.line || (other.range.end.line === this.range.end.line && other.range.end.character> this.range.end.character)) {
            end = other.range.end;
        }

        this.range = new vscode.Range(start,end);
    }
    


};

// all selections will be in the same editor
let allTargets: UserTarget[]=[];
let mode: "range"| "list" = "range";

export function setRange(selection:UserTarget,union:boolean|null=null){

    let actual_mode = mode;
    if (union){
        actual_mode = "range";
    }
    if( allTargets.length === 0){
        allTargets = [selection];
    }
    if (selection.editor.document.uri !== allTargets[0].editor.document.uri){
        allTargets = [selection];
    }
    
    switch (mode) {
        case "list":
            allTargets = [selection,...allTargets];
            break;
        case "range":
            allTargets[0].union(selection);            
            break;
    
        default:
            break;
    }
    highlight(allTargets);
    
}

export function clearSelection(){
    allTargets=  [];
}

class TmpSelection{

    private old_selection;
    public isSet;
    constructor(){
        this.isSet=true;
        if (allTargets.length === 0){
            this.isSet = false;
            this.old_selection=undefined;
            return;
        }

        this.old_selection = allTargets[0].editor.selection;
        let ranges = allTargets.map( sel =>  new vscode.Selection(sel.range.start,sel.range.end));
        allTargets[0].editor.selections = ranges;
    }

    reset(){
        if (this.old_selection){
            allTargets[0].editor.selection=this.old_selection;
        }
    }
}

export function selectAll():TmpSelection{
    return new TmpSelection();
}
