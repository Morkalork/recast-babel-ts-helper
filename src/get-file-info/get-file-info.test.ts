import { getFileInfo } from "./get-file-info";
import fs from "fs";
import * as vscode from "vscode";

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

jest.mock("vscode", () => ({
  window: {
    activeTextEditor: {
      document: {
        getText: () => "test",
        uri: { file: "", fsPath: "/test.ts" },
        fileName: "file.ts",
      },
    },
  },
  Uri: {
    file: jest.fn(),
  },
}));

describe("getFileInfo", () => {
  it("should work with a valid file path", async () => {
    const filePath = "file.ts";
    const fsMock = jest.mocked(fs);
    fsMock.readFileSync.mockReturnValue("text");

    const result = await getFileInfo(filePath);
    expect(result.text).toEqual("text");
    expect(vscode.Uri.file).toHaveBeenCalledWith(filePath);
    expect(result.fileName).toEqual("file.ts");
    expect(result.fileExtension).toEqual("ts");
  });

  it("should work with an undefined file path", async () => {
    const fsMock = jest.mocked(fs);
    fsMock.readFileSync.mockReturnValue("text");

    const result = await getFileInfo(undefined);
    expect(result.text).toEqual("test");
    expect(result.currentlyOpenFileUri.fsPath).toEqual("/test.ts");
    expect(result.fileName).toEqual("file.ts");
    expect(result.fileExtension).toEqual("ts");
    expect(result.dir).toBe("/");
  });
});
