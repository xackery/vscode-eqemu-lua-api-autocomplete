"use strict";

import vscode = require('vscode');
import EQEmuApiData from "./EQEmuApiData";
import { getLastMatch } from "./utils";

const wordsRegex = /([\w\[\]]+\.*[\w\[\]\.]*)/g;

export class EQEmuHover implements vscode.HoverProvider {
    constructor(private apiData: EQEmuApiData) { }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        return new Promise<vscode.Hover>((resolve, reject) => {
            let lineText = document.lineAt(position.line).text;
            let wordRange = document.getWordRangeAtPosition(position);

            if (!wordRange) {
                return reject();
            }

            let lineTillCurrentWord = lineText.substr(0, wordRange.end.character);
            let match:string = getLastMatch(wordsRegex, lineTillCurrentWord);
            
            if (!match) {
                return reject();
            }   

            let words = match.split(".");
            let wordNullable = words.pop();
            let word = wordNullable!;
            let type = this.apiData.findType(words);

            if (!type) {
                return reject();
            }


            let target:EQEmuType = {};
            if (type.properties && type.properties[word]) {
                target = type.properties[word]!;
            } else if (type.name === word) {
                target = type;
            } else if (target.name === "" || (!target.type && !target.name)) {
                return reject();
            }

            let content = `_${target.type}_`;

            if (target.name && target.name !== target.type) {
                content = `**${target.name}**` + ": " + content;
            }

            if (target.doc) {
                content += "\n\n" + target.doc;
            }

            resolve(new vscode.Hover(content, wordRange));
        });
    }
}
