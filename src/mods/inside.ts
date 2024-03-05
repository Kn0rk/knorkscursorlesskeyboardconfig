import * as vscode from 'vscode';
import { PositionMath } from "../utils/ExtendedPos";
import { getCursor, setTempSelection } from '../handler';


function getPreviousChar(editor:vscode.TextEditor,cursor:vscode.Position){
    if (cursor.character>1){
        cursor = new vscode.Position(cursor.line,cursor.character-1);
    }
    else if ( cursor.line === 0){
        return null;
    }
    else{
        cursor =editor.document.lineAt(cursor.line-1).range.end;
    }
    return cursor;
}

function getNextChar(editor:vscode.TextEditor,cursor:vscode.Position){
    let curLine = editor.document.lineAt(cursor.line);
    if (cursor.character<curLine.range.end.character){
        cursor = new vscode.Position(cursor.line,cursor.character+1);
    }
    else if ( cursor.line === editor.document.lineCount){
        return null;
    }
    else{
        cursor =editor.document.lineAt(cursor.line+1).range.start;
    }
    return cursor;
}




export function insideAny() {
    let cursor = getCursor();
    if(cursor === null){
        return;
    }
    let cursorPos = cursor.pos;
    let editor = cursor.editor;

    // find the next bracket before and after the cursor
    let openingChars = ["{","[","(",'<'];
    let ambigous = ["\"","'"];

    let beforeCursor = cursorPos;
    let character;

    let openingPos:vscode.Position|null=null;
    let firstAmbigous:vscode.Position|null=null;
    

    let ambigousCount=0;
    while( openingPos === null){
        let prePos = getPreviousChar(editor,beforeCursor);
        if (prePos === null){
            break;
        }
        beforeCursor = prePos;            
        
        character = editor.document.lineAt(prePos.line).text.at(prePos.character)!;
        if( openingChars.includes(character)){
            openingPos=beforeCursor;
        }

        if (ambigous.includes(character)){
            ambigousCount+=1;
            if (ambigousCount === 1){
                firstAmbigous=prePos;
            }   
        }
    }
    if(openingPos === null){
        // todo error?
        return;
    }

    if ( ambigousCount % 2 ===1 && new PositionMath(openingPos).lessThan(new PositionMath(firstAmbigous!)) ){ 
        openingPos=firstAmbigous;
    }
    let openingCharacter = editor.document.lineAt(openingPos!.line).text.charAt(openingPos!.character);
    let closing = ["}","]",")",'>'];
    let closingCharacter="]";
    if (openingChars.includes(openingCharacter)){
        closingCharacter = closing.at(openingChars.indexOf(openingCharacter))!;
    }else{
        closingCharacter=openingCharacter;
    }

    beforeCursor =  cursorPos;
    let closingPos:vscode.Position|null=null;
    while(closingPos === null){
        let nextPos = getNextChar(editor,beforeCursor);
        if (nextPos === null){
            break;
        }
        beforeCursor = nextPos;
        character = editor.document.lineAt(beforeCursor.line).text.at(beforeCursor.character)!;

        if (character === closingCharacter){
            closingPos = beforeCursor;
        }
    }

    if(openingPos !== null && closingPos !==null){
        setTempSelection(new vscode.Selection(getNextChar(editor,openingPos)!,closingPos), editor);
    }
    
}