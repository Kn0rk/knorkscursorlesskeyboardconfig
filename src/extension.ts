// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "knorkscursorlesskeyboardconfig" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('knorkscursorlesskeyboardconfig.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from knorkscursorlesskeyboardconfig!');

		
			var command = {
				"version": 6,
				"usePrePhraseSnapshot":false,
				"action": {
					"name": "highlight",
					"target": {
						"type": "primitive",
						"mark": {
							"type": "cursor",
						}
					}
				},
	
			};


		var commandId="cursorless.command";
		var args=[command];
		await vscode.commands.executeCommand(commandId, ...args);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
