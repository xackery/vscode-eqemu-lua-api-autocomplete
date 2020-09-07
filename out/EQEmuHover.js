"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EQEmuHover = void 0;
const vscode = require("vscode");
const utils_1 = require("./utils");
const { isArray } = Array;
const { assign, keys } = Object;
const wordsRegex = /([\w\[\]]+\.*[\w\[\]\.]*)/g;
class EQEmuHover {
    constructor(apiData) {
        this.apiData = apiData;
    }
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            let lineText = document.lineAt(position.line).text;
            let wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange)
                return reject();
            let lineTillCurrentWord = lineText.substr(0, wordRange.end.character);
            let match = utils_1.getLastMatch(wordsRegex, lineTillCurrentWord);
            let wordsStr = match ? match[1] : null;
            if (!wordsStr)
                return reject();
            let words = wordsStr.split(".");
            let word = words.pop();
            let type = this.apiData.findType(words);
            if (!type)
                return reject();
            let target;
            if (type.properties && type.properties[word]) {
                target = type.properties[word];
            }
            else if (type[word]) {
                target = type[word];
            }
            else if (!target || (!target.type && !target.name)) {
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
exports.EQEmuHover = EQEmuHover;
//# sourceMappingURL=EQEmuHover.js.map