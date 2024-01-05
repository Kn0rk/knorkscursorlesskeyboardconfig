import KeyboardHandler, { DisplayOptions } from "./KeyboardHandler";

import * as vscode from 'vscode';
import { setMode } from "./extension";
import { runCursorlessCommand } from "./executeCursorlessCommand";
import { ActionDescriptor } from "./types/ActionDescriptor";
export class TargetMark {
    keyboardHandler: KeyboardHandler;
    inputDisposable:vscode.Disposable | undefined;
    constructor(keyboardHandler:KeyboardHandler) {
        this.keyboardHandler = keyboardHandler;
        this.selectMark = this.selectMark.bind(this);      
    }

    selectMark(colorShape:string){
        // we need to set the mode to false so that the keyboard handler doesn't
        // keyboard shortcuts will be disabled while the user is selecting a mark
        
        setMode(false);
        const options:DisplayOptions = {
            cursorStyle:vscode.TextEditorCursorStyle.Line,
            statusBarText:"Select Mark"};

        this.keyboardHandler.awaitSingleKeypress(options).then((text:string|undefined) => {
            if (text === undefined) {
                return;
            }
            this.handleInput(text, colorShape);
        });
        
    }

    handleInput(text:string, colorShape:string):Promise<unknown> {
        setMode(true);

    //     var command = {
    //         "version": 6,
    //         "usePrePhraseSnapshot":false,
    //         "action": {
    //             "name": "highlight",
    //             "target": {
    //                 "type": "primitive",
    //                 "mark": {
    //                     "type": "decoratedSymbol",
    //                     "symbolColor": colorShape,
    //                     "character": text,
    //                 }
    //             }
    //         },
    
    //     };



    // var commandId="cursorless.command";
    // var args=[command];
    // vscode.commands.executeCommand(commandId, ...args).then(() => {});

    var action:ActionDescriptor = {
        "name": "highlight",
        "target": {
            "type": "primitive",
            "mark": {
                "type": "decoratedSymbol",
                "symbolColor": colorShape,
                "character": text,
            }
        }
    };
    runCursorlessCommand(action);

    return Promise.resolve();
    }

    removeListener(){
        this.inputDisposable?.dispose();
        this.inputDisposable = undefined;
    }

}


