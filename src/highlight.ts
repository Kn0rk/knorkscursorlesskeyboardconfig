import * as vscode from 'vscode';
import { Hat } from './hats/createDecorations';
import { TempSelection } from './TempCursor';


let background: vscode.TextEditorDecorationType | null = null;
let cursor_deco: vscode.TextEditorDecorationType | null = null;
let switchCursor: boolean = true;
// export function highlight(
//     sel:TempSelection
// ){

// 	if (background){
// 		background.dispose();
// 	}
// 	background = vscode.window.createTextEditorDecorationType({
// 		backgroundColor:   'rgba(0,0,150,0.17)',
// 	});

// 	sel.editor.setDecorations(background,
// 		[{ range: sel[i].range }]);




// }

export function clearHighlights() {
	if (cursor_deco) {
		cursor_deco.dispose();
	}
}

export function highlightCursor(elem: vscode.Position, doc: vscode.TextEditor,forceDraw:boolean=false) {
	if (cursor_deco) {
		cursor_deco.dispose();
	}
	if (forceDraw || switchCursor) {
		cursor_deco = vscode.window.createTextEditorDecorationType({
			borderWidth: '0px 2px 0px 0px',
			borderStyle: 'dotted',
		});

		doc.setDecorations(cursor_deco, [
			new vscode.Range(
				elem,
				new vscode.Position(elem.line, elem.character - 1)
			)
		]);

	}

	switchCursor = !switchCursor;
}