import * as vscode from 'vscode';
import { Hat } from './hats/createDecorations';
import { UserTarget } from './handler';

let background:vscode.TextEditorDecorationType|null = null;
let cursor_deco:vscode.TextEditorDecorationType|null = null;
let switchCursor:boolean=true;
export function highlight(
    sel:UserTarget[]
){
	
	if (background){
		background.dispose();
	}
	background = vscode.window.createTextEditorDecorationType({
		backgroundColor:   'rgba(0,0,150,0.17)',
	});
	for( let i = 0;i<sel.length;i++){
		sel[i].editor.setDecorations(background,
			[{ range: sel[i].range }]);
	}


    
}

export function highlightCursor(  sel:UserTarget[]){
	if (cursor_deco){
		cursor_deco.dispose();
	}
	if (switchCursor){
	cursor_deco = vscode.window.createTextEditorDecorationType({
		borderWidth:   '0px 2px 0px 0px',
		borderStyle: 'dotted',
	});
	for( let i = 0;i<sel.length;i++){
		let elem = sel[i];
		if (elem.cursorPosition === "end"){
			elem.editor.setDecorations(cursor_deco,
				[{ range: new vscode.Range(
					new vscode.Position(elem.range.end.line,elem.range.end.character-1),
					elem.range.end
				)  }]);
		}else{
			elem.editor.setDecorations(cursor_deco,
				[{ range: new vscode.Range(
					new vscode.Position(elem.range.start.line,elem.range.start.character-1),
					elem.range.start
				)  }]);
		}
	}
	}
	switchCursor=!switchCursor;
}