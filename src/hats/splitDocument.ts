
export type HatCandidate={
    startOffset:number,
    endOffset:number,
    // todo delete?
    word: string,
};

export function splitDocument(
    text: string,
    cursorOffset:number = 0 
):HatCandidate[]{

    

    // extract tokens and return them in order of importance

    // split into lines
    const regEx = /[^\r\n]+/g;
    let match;



    var results:HatCandidate[]=[];

    while (match = regEx.exec(text)){
        let sen = text.slice(match.index,match.index+match[0].length);
        const wordRegex = /\b\w+\b/g;
        let firstWord = wordRegex.exec(sen);
        if (!firstWord){
            continue;
        }
        const candidate:HatCandidate = {
            startOffset:match.index+firstWord.index,
            endOffset:match.index+firstWord.index+firstWord[0].length,
            word:firstWord[0]
        };
        results.push(candidate);
    }

    results.sort((a,b)=> Math.abs(a.startOffset-cursorOffset) -Math.abs( b.startOffset-cursorOffset));

    return results;

}