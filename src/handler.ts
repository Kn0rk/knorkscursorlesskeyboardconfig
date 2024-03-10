import { Decoration, Hat } from "./hats/createDecorations";
import * as vscode from 'vscode';
import { clearHighlights, highlightCursor, highlightSelection } from "./highlight";
import { TempCursor } from "./TempCursor";
import { PositionMath } from "./utils/ExtendedPos";


let deco_map: { [key: string]: any } = new Map();
export function setHat(deco: Decoration, hat: Hat) {
    deco_map.set(decoToString(deco), hat);
}

export function clearAllHats() {
    deco_map = {};
}

export function getHat(deco: Decoration): Hat {
    let deco_string = decoToString(deco);
    if (!deco_map.has(deco_string)) {
        vscode.window.showInformationMessage(`${deco_string} not in map.`);
    }
    return deco_map.get(deco_string);
}

function decoToString(deco: Decoration): string {
    return `${deco.style}:${deco.character}`;
}
setInterval(() => {
    if (tempCursor) {
        highlightCursor(tempCursor.pos, tempCursor.editor);
    }
}, 500);

let tempCursor: TempCursor | null = null;
let tempSelection: vscode.Selection | null = null;




export function setTempCursor(cursor: TempCursor) {
    tempCursor = cursor;
    highlightCursor(cursor.pos, cursor.editor, true);
    highlightSelection(tempSelection,cursor.editor);
    setCursorBlink();
}

export function setTempSelection(sel:vscode.Selection,editor:vscode.TextEditor){
    tempSelection=sel;
    tempCursor=new TempCursor(tempSelection.active,editor);
    highlightCursor(tempCursor.pos, tempCursor.editor, true);
    highlightSelection(tempSelection,tempCursor.editor);
    setCursorBlink();
}

function extendRangeByCursor(
    cursor: TempCursor,
    range: vscode.Range
) {

    if (new PositionMath(cursor.pos).greaterThan(new PositionMath(range.start))) {
        return new vscode.Selection(cursor.pos, range.start);
    } else {
        return new vscode.Selection(range.end, cursor.pos);
    }
}


export function moveTempCursor(
    newCursor: TempCursor,
    shift: boolean = false
) {
    if (tempCursor === null && shift) {
        newCursor.editor.selection = extendRangeByCursor(newCursor, newCursor.editor.selection);
    } else if (tempCursor === null && !shift) {
        tempSelection=null;
        newCursor.editor.selection = new vscode.Selection(newCursor.pos, newCursor.pos);
    } else if (tempCursor && shift) {
        if (!tempSelection){
            tempSelection=new vscode.Selection(tempCursor.pos,tempCursor.pos);
        }
        tempSelection = extendRangeByCursor(newCursor, tempSelection);
        tempCursor=newCursor;
    } else {
        tempSelection=null;
        tempCursor = newCursor;
    }

    highlightCursor(newCursor.pos, newCursor.editor, true);
    highlightSelection(tempSelection,newCursor.editor);
    setCursorBlink();
}

export function makeTempSelectionActive(){
    if( tempCursor && tempSelection ){
        tempCursor.editor.selection=tempSelection;
    }
    else if (tempCursor){
        tempCursor.editor.selection=new vscode.Selection(tempCursor.pos,tempCursor.pos);
    }
    clearSelection();
}

export function getCursor(): TempCursor | null {
    if (tempCursor) {
        return tempCursor;
    }
    else {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            return new TempCursor(editor.selection.active, editor);
        }
    }
    return null;
}

function setCursorBlink(){
    const config = vscode.workspace.getConfiguration();
    let cursorBlinking =  "blink";
    if(tempCursor){
       cursorBlinking =  "solid";	
    }
    config.update("editor.cursorBlinking", cursorBlinking, vscode.ConfigurationTarget.Workspace);
}

export function clearSelection() {
    tempCursor = null;
    tempSelection = null;
    clearHighlights();
    setCursorBlink();
}

class TmpSelection{

    private old_selection;
    public isSet;
    constructor(){
        this.isSet=true;
        if (tempCursor === null || tempSelection === null){
            this.isSet = false;
            this.old_selection=undefined;
        }else{
            this.old_selection = tempCursor.editor.selection;
            tempCursor.editor.selection = tempSelection;
        }

    }

    reset(){
        if (this.old_selection){
            tempCursor!.editor.selection=this.old_selection;
        }
    }
}

export function selectAll():TmpSelection{
    return new TmpSelection();
}