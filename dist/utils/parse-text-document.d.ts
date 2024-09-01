import * as vscode from "vscode";
type ReturnData = {
    text: string;
    currentlyOpenFileUri: vscode.Uri;
    fileName: string;
    fileExtension?: string;
};
export declare const parseTextDocument: (doc: vscode.TextDocument | undefined) => Promise<ReturnData>;
export {};
