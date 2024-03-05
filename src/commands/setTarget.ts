import KeyboardHandler, { DisplayOptions } from "../KeyboardHandler";

import * as vscode from 'vscode';
import { setMode } from "../extension";
import { getHat, setTempCursor } from "../handler";
import { Style, hatToEditor, hatToPos } from "../hats/createDecorations";
import { KCKCTextDocument, TempCursor } from "../TempCursor";



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
            setTempCursor(new TempCursor(start,editor));
        setMode(true);
        });
    
    
    }

}


