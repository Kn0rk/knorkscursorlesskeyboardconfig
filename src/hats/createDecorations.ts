import { setRange } from "../handler";
import { HatCandidate } from "./splitDocument";
import * as vscode from 'vscode';

const styles = ["solid","double"] as const;
export type Style = typeof styles[number];


export type Decoration={
    style: Style,
    character: string,
};

// export class Decoration {
//     constructor(
//         public style: Style,
//         public character: string,
//     ) {
//         this.toStringRepr = this.toStringRepr.bind(this);
//     }

//     toStringRepr(): string {
//         return `${this.style}:${this.character}`;
//     }

//     static fromString(str: string): Decoration {
//         const [style, character] = str.split(":");
//         if (styles.includes(style as Style)) {
//             return new Decoration(style as Style, character);
//         } else {
//             throw new Error(`Invalid style: ${style}`);
//         }
//     }
// }



export type Hat =HatCandidate &{charOffset:number};


export function hatToEditor(hat:Hat):vscode.TextEditor{
    let editor=  vscode.window.activeTextEditor;
    if (!editor){
        throw Error;
    }
    return editor;
}

export function hatToPos(hat:Hat):[vscode.Position,vscode.Position]{
    let editor = hatToEditor(hat);
    let start = editor.document.positionAt(hat.startOffset);
    let end =  editor.document.positionAt(hat.endOffset);
    return [start,end];
}

function getAllDecos(): Decoration[]{
    const alphabet: string[] = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    const styles:("solid" | "double")[] = ["solid","double"];

    const decos:Decoration[] = [];
    for (let s of styles){
        for (let char of alphabet){
            const deco:Decoration = {
                style: s,
                character: char
            }
            decos.push(deco);
        }
    }

    return decos;
}

function getMatchingDeco(char:string,decos:Decoration[]):number{
    for ( let i = 0; i < styles.length;i++){
        let idx = decos.findIndex(
            deco => deco.character === char && deco.style === styles[i]
        );
        if ( idx >=0){
            return idx;
        }

    }
    return -1;

}

export type DecoProto = {
    deco: Decoration,
    hat:Hat
};

export function createDecoration(text:string,candidates:HatCandidate[]):DecoProto[]{

    const decos = getAllDecos();

    let result: DecoProto[] = [];
    for (let i = 0; i< candidates.length; i++){
        const candidate = candidates[i];
        const word = text.substring(candidate.startOffset,candidate.endOffset);
        for (let j = 0;j<word.length;j++){
            let idx = getMatchingDeco(word.charAt(j),decos);
            if (idx >=0){
                const deco = decos[idx];
                let hat:Hat = {...candidate,charOffset:j};
                let res: DecoProto = {deco,hat};
                result.push(res);
                decos.splice(idx,1);
                break;
            }
        }
    }
    return result;
}