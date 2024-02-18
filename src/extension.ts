// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import KeyboardHandler from './KeyboardHandler';
import { StatusBarItem } from './StatusBarItem';
import { TargetMark } from './commands/setTarget';
import { decoration } from './decorator';
import { setCursor } from './setCursor';
import { selectAction, selectActionReset, selectActionResetAction } from './commands/bring';
import { modAll } from './mods/basic';

var g_mode = false;
export function setMode(mode: boolean) {
	// vscode.window.showInformationMessage(`Cursorless mode ${mode ? "on" : "off"}`);
	g_mode = mode;
	vscode.commands.executeCommand("setContext", "kckc.mode", mode);
	if(mode){
		setCursor(vscode.TextEditorCursorStyle.BlockOutline);
	}
	else{
		setCursor(vscode.TextEditorCursorStyle.Line);
	}

}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "kckc" is now active!');
	const statusBarItem = StatusBarItem.create("cursorless.showQuickPick");
	const keyboardHandler = new KeyboardHandler(context, statusBarItem);
	
	const targetMarkInstance = new TargetMark(keyboardHandler);
	keyboardHandler.init();
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('kckc.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from kckc!');		
		// targetMark.selectMark("default");
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

// This method is called when your extension is deactivated
export function deactivate() {
	
}
