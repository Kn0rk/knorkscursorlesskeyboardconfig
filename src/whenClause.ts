import * as vscode from 'vscode';

export function setuserMode(modeName: string, mode: boolean) {
    modeName = "kckc."+modeName;
    vscode.commands.executeCommand("setContext","kckc.shift" , mode);
}

export async function toggleUserMode(modeName: string) {

    setuserMode(modeName, !true);
}