import * as vscode from 'vscode';
import { ActionDescriptor } from './types/ActionDescriptor';

export function runCursorlessCommand(action:ActionDescriptor) {
    var command = {
        "version": 6,
        "usePrePhraseSnapshot":false,
        "action": action,
    };
    var commandId="cursorless.command";
    var args=[command];
    vscode.commands.executeCommand(commandId, ...args).then(() => {});
}