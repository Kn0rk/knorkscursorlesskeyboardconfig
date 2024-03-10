import { KCKCTextDocument, KCKCTextLine } from "../TempCursor";
import * as vscode from 'vscode';


export class FakeLine implements KCKCTextLine{
    readonly text:string;
    readonly range:vscode.Range;
    constructor(text:string, range:vscode.Range){
        this.text = text;
        this.range = range;
    }


    

}
export class FakeDocument implements KCKCTextDocument{
    
    lines:FakeLine[];
    readonly lineCount:number;
    constructor(public text:string){
        let txt_lines = this.text.split("\n");
        this.lines = [];
        for (let i = 0; i < txt_lines.length; i++) {
            let line = new FakeLine(txt_lines[i],new vscode.Range(i,0,i,txt_lines[i].length));
            this.lines.push(line);
        }        
        this.lineCount = this.lines.length;
    }

    lineAt(line: number): KCKCTextLine {
        return this.lines[line];
    }



}