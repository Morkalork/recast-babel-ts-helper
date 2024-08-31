import { parseTextDocument } from "./parse-text-document";
import { type TextDocument, Uri, workspace } from "vscode";
import { mock } from "jest-mock-extended";

describe("parseTextDocument", () => {
  it("should throw an error if the document is undefined", async () => {
    try {
      await parseTextDocument(undefined);
    } catch (error) {
      expect(error).toEqual(
        new Error("currently open file uri could not be determined.")
      );
    }
  });

  it("should throw an error if the document is a test file", async () => {
    const workspaceDocument = mock<TextDocument>({
      fileName: "file.test.ts",
    });

    try {
      await parseTextDocument(workspaceDocument);
    } catch (error) {
      expect(error).toEqual(
        new Error(`The file "file.test.ts" is already a test file.`)
      );
    }
  });

  it("should return the text, currentlyOpenFileUri, and fileExtension", async () => {
    const workspaceDocument = mock<TextDocument>({
      fileName: "file.ts",
      getText: () => "text",
      uri: mock<Uri>({
        fsPath: "file.ts",
      }),
    });

    const result = await parseTextDocument(workspaceDocument);

    expect(result.text).toEqual("text");
    expect(result.currentlyOpenFileUri.fsPath).toEqual("file.ts");
    expect(result.fileExtension).toEqual("ts");
  });
});
