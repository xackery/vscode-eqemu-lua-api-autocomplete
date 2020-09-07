"use strict"
import * as vscode from 'vscode';
import EQEmuApiData from "./EQEmuApiData"
import { EQEmuAutocomplete } from "./EQEmuAutocomplete"
import { EQEmuHover } from "./EQEmuHover"

const LUA_MODE = { language: "lua", scheme: "file" }

export function activate(context: vscode.ExtensionContext) {
    let dataPath = context.asAbsolutePath("./data")
    const eqEmuApiData = new EQEmuApiData(dataPath)

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            LUA_MODE,
            new EQEmuAutocomplete(eqEmuApiData),
            '.'
        )
    )

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            LUA_MODE,
            new EQEmuHover(eqEmuApiData)
        )
    )
}

// this method is called when your extension is deactivated
export function deactivate() {
}