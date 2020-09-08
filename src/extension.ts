/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('lua', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			const linePrefix = document.lineAt(position).text.substr(0, position.character);
			if (position.character !== 0 && !linePrefix.endsWith('')) {
				return undefined;
			}

			const results:vscode.CompletionItem[] = [];
			
			const eqCompletion = new vscode.CompletionItem('eq', vscode.CompletionItemKind.Class);
			eqCompletion.insertText = new vscode.SnippetString("eq.");
			eqCompletion.documentation = new vscode.MarkdownString("Everquest Global Namespace");
			eqCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
			results.push(eqCompletion);
			return results;
		}
	}));

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('lua', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('e.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('self', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('other', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		}, '.' // triggered whenever a '.' is being typed
	));

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('lua', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('e.other:')) {
					return undefined;
				}

				const say = new vscode.CompletionItem('Say', vscode.CompletionItemKind.Function);
				say.insertText = new vscode.SnippetString("Say(${1|message|})");
				say.documentation = new vscode.MarkdownString("Say a message");
				return [
					say
				];
			}
		}, ':' // triggered whenever a '.' is being typed
	));

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('lua', {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('eq.')) {
					return undefined;
				}
				const results = [];

				const debug = new vscode.CompletionItem('debug', vscode.CompletionItemKind.Method);
				
				debug.detail = "debug(message:string) -- void";
				debug.insertText = new vscode.SnippetString('debug(${0:message:string})');
				debug.documentation = new vscode.MarkdownString("Echos a GM only debug message");
				results.push(debug);
				return results;
			}
		}, '.' // triggered whenever a '.' is being typed
	));

	context.subscriptions.push(vscode.languages.registerHoverProvider('lua', {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {return new Promise<vscode.Hover>((resolve, reject) => {
			const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return reject();
            }
			const linePrefix = document.lineAt(position).text.substr(0, position.character);
			const lineText = document.lineAt(position.line).text;
            let lineTillCurrentWord = lineText.substr(0, wordRange.end.character);
            if (lineTillCurrentWord.search(" ") > 0) {
                lineTillCurrentWord = lineTillCurrentWord.split(" ").pop()!;                
            }
			
			if (lineTillCurrentWord === "eq") {
				return resolve(new vscode.Hover( new vscode.MarkdownString("```lua\neq\n```\n[eq on questapi](https://questapi.firebaseapp.com/lua/eq)\n\nEQ Namespace are globally accessible functions"), wordRange));
			}

			if (lineTillCurrentWord === "eq.debug") {
				return resolve(new vscode.Hover(new vscode.MarkdownString("```lua\neq.debug(message:string) -- void\n```\n[eq.debug on questapi](https://questapi.firebaseapp.com/lua/eq/debug)\n\nEchos a GM only debug message"), wordRange));
            }

			return resolve(new vscode.Hover(new vscode.MarkdownString("unknown: "+lineTillCurrentWord), wordRange));
            //return reject();
		});}
	}));
}
