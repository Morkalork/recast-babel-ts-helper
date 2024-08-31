import * as vscode from "vscode";
import path from "path";

type ReturnData = {
  text: string;
  currentlyOpenFileUri: vscode.Uri;
  fileName: string;
  fileExtension?: string;
};

export const parseTextDocument = async (
  doc: vscode.TextDocument | undefined
): Promise<ReturnData> => {
  if (!doc) {
    throw new Error("currently open file uri could not be determined.");
  }

  if (doc.fileName.includes(".test.")) {
    const fileName = path.basename(doc.fileName);
    throw new Error(`The file "${fileName}" is already a test file.`);
  }

  const text = doc.getText();
  const fileName = doc.fileName;
  const fileExtension = fileName.split(".").pop();

  const currentlyOpenFileUri = doc.uri;

  return { text, currentlyOpenFileUri, fileExtension, fileName };
};
