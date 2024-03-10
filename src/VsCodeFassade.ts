import * as vscode from 'vscode';

export interface KCKCTextLine{
    readonly text:string;
    readonly range:vscode.Range;
}

export interface KCKCTextDocument{
    lineAt(line: number): KCKCTextLine;
    readonly lineCount:number;
    
}

export class TempCursor{
    constructor(public pos:vscode.Position,public editor:vscode.TextEditor){}
}

