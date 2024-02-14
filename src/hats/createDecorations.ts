import { HatCandidate } from "./splitDocument";

const styles = ["solid","double"] as const;
type Style = typeof styles[number];
export type Decoration = {
    style: Style,
    character: string;
};


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

export type DecoProto = Decoration & HatCandidate &{ charOffset:number}

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
                let res: DecoProto = {...deco,...candidate,charOffset:j};
                result.push(res);
                decos.splice(idx,1);
                break;
            }
        }
    }
    return result;
}