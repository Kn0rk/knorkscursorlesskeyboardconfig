import KeyboardHandler, { DisplayOptions } from "../KeyboardHandler";

import * as vscode from 'vscode';
import { setMode } from "../extension";
import { UserTarget, getHat, setRange } from "../handler";
import { Style, hatToEditor, hatToPos } from "../hats/createDecorations";



export class TargetMark {
    keyboardHandler: KeyboardHandler;
    inputDisposable:vscode.Disposable | undefined;
    constructor(keyboardHandler:KeyboardHandler) {
        this.keyboardHandler = keyboardHandler;   
        this.setHat = this.setHat.bind(this);
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
            setRange([new UserTarget(editor,new vscode.Range(start,end),end)]);
                    
        setMode(true);
            
        });
    
    
    }

}


