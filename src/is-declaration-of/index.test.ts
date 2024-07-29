import { isDeclarationOf } from "./index";
import { describe, expect, it } from "@jest/globals";
import {
  FunctionDeclaration,
  VariableDeclaration,
  blockStatement,
  functionDeclaration,
  identifier,
} from "@babel/types";

describe("isDeclarationOf", () => {
  const FunctionDeclarationNode = functionDeclaration(
    identifier("test"),
    [],
    blockStatement([]),
    false,
    false
  );

  it("should work for correct type", () => {
    expect(
      isDeclarationOf<FunctionDeclaration>(
        FunctionDeclarationNode,
        "FunctionDeclaration"
      )
    ).toBe(true);
  });
  it("should not work for incorrect type", () => {
    expect(
      isDeclarationOf<VariableDeclaration>(
        FunctionDeclarationNode,
        "VariableDeclaration"
      )
    ).toBe(false);
  });
});
