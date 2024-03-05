import * as vscode from 'vscode';



let background: vscode.TextEditorDecorationType | null = null;
let cursor_deco: vscode.TextEditorDecorationType | null = null;
let switchCursor: boolean = true;

export function clearHighlights() {
	if (cursor_deco) {
		cursor_deco.dispose();
	}
	if (background){
		background.dispose();
	}
}

export function highlightSelection(sel: vscode.Selection|null, editor: vscode.TextEditor) {
	if (!sel){
		return;
	}
	if (background){
		background.dispose();
	}
	background = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(0,0,150,0.17)',
	});
	editor.setDecorations(background,
		[{ range: sel }]);
}


export function highlightCursor(elem: vscode.Position, doc: vscode.TextEditor, forceDraw: boolean = false) {
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
				new vscode.Position(elem.line, elem.character)
			)
		]);

	}

	switchCursor = !switchCursor;
}