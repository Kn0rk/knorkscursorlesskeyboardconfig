// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import KeyboardHandler from './KeyboardHandler';
import { StatusBarItem } from './StatusBarItem';
import { TargetMark } from './commands/setTarget';
import { decoration } from './hats/textHatDecoration';
import { setCursorStyle } from "./highlightSelection";
import { modAll } from './cursorModifier/basic';
import { clearSelection, makeTempSelectionActive } from './handler';
import { selectAction, selectActionReset, selectActionResetAction } from './commands/bring';
import { setuserMode, toggleUserMode } from './whenClause';


var g_mode = false;
export function setMode(mode: boolean) {
	// vscode.window.showInformationMessage(`Cursorless mode ${mode ? "on" : "off"}`);
	g_mode = mode;
	vscode.commands.executeCommand("setContext", "kckc.mode", mode);
	if(mode){
		setCursorStyle(vscode.TextEditorCursorStyle.BlockOutline);
	}
	else{
		setCursorStyle(vscode.TextEditorCursorStyle.Line);
	}
	clearSelection();

}


export function activate(context: vscode.ExtensionContext) {
	
	const statusBarItem = StatusBarItem.create("cursorless.showQuickPick");
	const keyboardHandler = new KeyboardHandler(context, statusBarItem);
	
	const targetMarkInstance = new TargetMark(keyboardHandler);
	keyboardHandler.init();
	let disposable = vscode.commands.registerCommand('kckc.helloWorld', async () => {
		vscode.window.showInformationMessage('Hello World from kckc!');		
	});
	context.subscriptions.push(disposable);



	disposable = vscode.commands.registerCommand('kckc.setHat', targetMarkInstance.setHat);
	context.subscriptions.push(disposable);


	disposable = vscode.commands.registerCommand('kckc.modeOn', () => { setMode( true); });
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.modeOff', () => { setMode(false); });
	context.subscriptions.push(disposable);


	disposable = vscode.commands.registerCommand('kckc.modeToggle', () => {
		setMode(!g_mode);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.selectActionReset', selectActionReset);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.selectAction', selectAction);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.selectActionResetAction', selectActionResetAction);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.modAllSelections', modAll);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.makeTempSelectionActive', makeTempSelectionActive);
	context.subscriptions.push(disposable);
	
	disposable = vscode.commands.registerCommand('kckc.toggleUserMode', toggleUserMode);
	context.subscriptions.push(disposable);

		
	disposable = vscode.commands.registerCommand('kckc.setUserMode', setuserMode);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('kckc.clearSelection', clearSelection);
	context.subscriptions.push(disposable);

	
	// when cursor moves, clear the targets
	decoration(context);
	vscode.window.onDidChangeTextEditorSelection(() => {
		decoration(context);
	});
	let activeEditor = vscode.window.activeTextEditor;
	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			decoration(context);
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			decoration(context);
		}
	}, null, context.subscriptions);

	
}

export function deactivate() {
	
	const config = vscode.workspace.getConfiguration();
    let cursorBlinking =  "blink";
	config.update("editor.cursorBlinking", cursorBlinking, vscode.ConfigurationTarget.Workspace);
	clearSelection();
	vscode.window.showInformationMessage('Deactive!');	
}
