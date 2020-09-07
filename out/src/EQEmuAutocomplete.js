"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const utils_1 = require("./utils");
const wordsRegex = /([\w\[\]]+\.[\w\[\]\.]*)/g;
class EQEmuAutocomplete {
    constructor(apiData) {
        this.apiData = apiData;
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            let match = utils_1.getLastMatch(wordsRegex, lineTillCurrentPosition);
            let line = match ? match[1] : "";
            let words = line.split(".");
            words.pop();
            let type = this.apiData.findType(words);
            if (!type || !type.properties) {
                return reject();
            }
            let suggestions = this.toCompletionItems(type.properties);
            return resolve(suggestions);
        });
    }
    toCompletionItems(types) {
        return utils_1.keys(types).map(key => this.toCompletionItem(types[key], key));
    }
    toCompletionItem(type, key) {
        const { doc, name, mode } = type;
        let completionItem = utils_1.assign(new vscode.CompletionItem(key), {
            detail: type.type,
            documentation: new vscode.MarkdownString([doc, mode].filter(Boolean).join("\n\n")),
            kind: vscode.CompletionItemKind.Property
        });
        if (type.type === "function") {
            utils_1.assign(completionItem, {
                detail: name,
                kind: vscode.CompletionItemKind.Function
            });
        }
        else if (type.type === "define") {
            utils_1.assign(completionItem, {
                kind: vscode.CompletionItemKind.Constant
            });
        }
        return completionItem;
    }
}
exports.EQEmuAutocomplete = EQEmuAutocomplete;
//# sourceMappingURL=EQEmuAutocomplete.js.map