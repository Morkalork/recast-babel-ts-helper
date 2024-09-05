import * as vscode from "vscode";

const defaultValues = {
  authority: "",
  fragment: "",
  scheme: "file",
  path: "",
  query: "",
  fsPath: "",
  with: jest.fn(),
  toJSON: jest.fn(),
};

export const makeUriFile = (
  options: Partial<Pick<vscode.Uri, "fsPath" | "path">>
): vscode.Uri => ({
  ...defaultValues,
  ...options,
});
