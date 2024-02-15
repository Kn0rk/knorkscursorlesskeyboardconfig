import * as vscode from 'vscode';
import { Hat } from './hats/createDecorations';

let background:vscode.TextEditorDecorationType|null = null;

export function highlight(
    activeEditor:vscode.TextEditor,
    startPos:vscode.Position,
    endPos:vscode.Position
){
    // const activeEditor = vscode.window.activeTextEditor;
	// if (!activeEditor) {
	// 	return;
	// }
	if (background){
		background.dispose();
	}
	background = vscode.window.createTextEditorDecorationType({
		backgroundColor:   'rgba(0.7,0,0,0.3)',
	});
   
    activeEditor.setDecorations(background,
    [{ range: new vscode.Range(startPos, endPos) }]);
}