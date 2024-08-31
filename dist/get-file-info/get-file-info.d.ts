import * as vscode from "vscode";
/**
 * Get the content and information about a file on disk, or the currently open file in the editor.
 * @param filePath The path to the file on disk, or undefined to get the currently open file in the editor.
 * @returns The text content of the file, the URI of the currently open file, and the file extension.
 */
export declare const getFileInfo: (filePath?: string) => Promise<{
    text: string;
    currentlyOpenFileUri: vscode.Uri;
    fileExtension: string;
}>;
