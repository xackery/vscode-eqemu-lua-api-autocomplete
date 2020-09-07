"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const EQEmuApiData_1 = require("./EQEmuApiData");
const EQEmuAutocomplete_1 = require("./EQEmuAutocomplete");
const EQEmuHover_1 = require("./EQEmuHover");
const LUA_MODE = { language: "lua", scheme: "file" };
function activate(context) {
    let dataPath = context.asAbsolutePath("./data");
    const eqEmuApiData = new EQEmuApiData_1.default(dataPath);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(LUA_MODE, new EQEmuAutocomplete_1.EQEmuAutocomplete(eqEmuApiData), '.'));
    context.subscriptions.push(vscode.languages.registerHoverProvider(LUA_MODE, new EQEmuHover_1.EQEmuHover(eqEmuApiData)));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map