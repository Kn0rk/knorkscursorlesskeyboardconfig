import KeyboardHandler, { DisplayOptions } from "../KeyboardHandler";

import * as vscode from 'vscode';
import { setMode } from "../extension";
import { addTarget } from "../executeCursorlessCommand";
import { ActionDescriptor } from "../types/ActionDescriptor";
import { DecoratedSymbolMark, PartialPrimitiveTargetDescriptor, PartialTargetDescriptor } from "../types/PartialTargetDescriptor.types";
import { getHat, setRange } from "../handler";
import { Style, hatToEditor, hatToPos } from "../hats/createDecorations";
import { highlight } from "../highlight";


export class TargetMark {
    keyboardHandler: KeyboardHandler;
    inputDisposable:vscode.Disposable | undefined;
    constructor(keyboardHandler:KeyboardHandler) {
        this.keyboardHandler = keyboardHandler;
        this.selectMark = this.selectMark.bind(this);     
        this.setHat = this.setHat.bind(this);
    }

    selectMark(colorShape:string){
        // we need to set the mode to false so that the keyboard handler doesn't
        // keyboard shortcuts will be disabled while the user is selecting a mark
        
        setMode(false);

        const options:DisplayOptions = {
            cursorStyle:vscode.TextEditorCursorStyle.Underline,
            statusBarText:"Select Mark"};

        this.keyboardHandler.awaitSingleKeypress(options).then((text:string|undefined) => {
            if (text === undefined) {
                return;
            }
            this.handleInput(text, colorShape);
        });
        
    }

    setHat(shape:Style){

                
        setMode(false);
        

        const options:DisplayOptions = {
            cursorStyle:vscode.TextEditorCursorStyle.Underline,
            statusBarText:"Select hat"};
        this.keyboardHandler.awaitSingleKeypress(options).then((text:string|undefined) => {
            if (text === undefined) {
                return;
            }


            let hat = getHat({style:shape,character:text});
            let editor = hatToEditor(hat);
            const [start,end] = hatToPos(hat);
            setRange(start,end,editor);
                    
        setMode(true);
            
        });
    
    
    }

    handleInput(text:string, colorShape:string) {


    var target:DecoratedSymbolMark = {        
            "type": "decoratedSymbol",
            "symbolColor": colorShape,
            "character": text,
    };
    addTarget(target);
    setMode(true);
    }

    removeListener(){
        this.inputDisposable?.dispose();
        this.inputDisposable = undefined;
    }

}


