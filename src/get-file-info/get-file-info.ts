import * as vscode from "vscode";
import fs from "fs";
import { parseTextDocument } from "../utils/parse-text-document";

/**
 * Get the content and information about a file on disk, or the currently open file in the editor.
 * @param filePath The path to the file on disk, or undefined to get the currently open file in the editor.
 * @returns The text content of the file, the URI of the currently open file, and the file extension.
 */
export const getFileInfo = async (filePath?: string) => {
  let text = "";
  let fileExtension = "";
  let currentlyOpenFileUri = vscode.Uri.file("");

  if (filePath) {
    text = fs.readFileSync(filePath, "utf8");
    const fileName = filePath.split("/").pop() || "";
    fileExtension = fileName.includes(".")
      ? filePath.split(".").pop() || ""
      : "";
    currentlyOpenFileUri = vscode.Uri.file(filePath);
  } else {
    const document = vscode.window.activeTextEditor?.document;
    const documentInfo = await parseTextDocument(document);
    text = documentInfo.text;
    fileExtension = documentInfo.fileExtension || "";
    currentlyOpenFileUri = documentInfo.currentlyOpenFileUri;
  }

  if (!fileExtension) {
    fileExtension = "js";
  }

  return { text, currentlyOpenFileUri, fileExtension };
};
