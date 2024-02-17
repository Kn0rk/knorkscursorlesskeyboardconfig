import * as vscode from 'vscode';
import { Hat } from './hats/createDecorations';
import { UserTarget } from './handler';

let background:vscode.TextEditorDecorationType|null = null;

export function highlight(
    sel:UserTarget[]
){
	
	if (background){
		background.dispose();
	}
	background = vscode.window.createTextEditorDecorationType({
		backgroundColor:   'rgba(0.7,0,0,0.3)',
	});
	for( let i = 0;i<sel.length;i++){
		sel[i].editor.setDecorations(background,
			[{ range: sel[i].range }]);
	}
    
}