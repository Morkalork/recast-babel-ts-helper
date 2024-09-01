import * as vscode from "vscode";
import fs from "fs";
import { parseTextDocument } from "../utils/parse-text-document";
import path from "path";

/**
 * Get the content and information about a file on disk, or the currently open file in the editor.
 * @param filePath The path to the file on disk, or undefined to get the currently open file in the editor.
 * @returns The text content of the file, the URI of the currently open file, and the file name and extension.
 */
export const getFileInfo = async (filePath?: string) => {
  let text = "";
  let fileName = "";
  let fileExtension = "";
  let currentlyOpenFileUri = vscode.Uri.file("");

  if (filePath) {
    text = fs.readFileSync(filePath, "utf8");
    fileName = filePath.split("/").pop() || "";
    fileExtension = fileName.includes(".")
      ? filePath.split(".").pop() || ""
      : "";
    currentlyOpenFileUri = vscode.Uri.file(filePath);
  } else {
    const document = vscode.window.activeTextEditor?.document;
    const documentInfo = await parseTextDocument(document);
    text = documentInfo.text;
    fileName = documentInfo.fileName;
    fileExtension = documentInfo.fileExtension || "";
    currentlyOpenFileUri = documentInfo.currentlyOpenFileUri;
  }

  if (!fileExtension) {
    fileExtension = "js";
  }

  const dir = path.dirname(currentlyOpenFileUri.fsPath);

  return { text, currentlyOpenFileUri, fileExtension, fileName, dir };
};
