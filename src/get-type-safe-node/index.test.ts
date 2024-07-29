import { blockStatement, functionDeclaration, identifier } from "@babel/types";
import { getTypeSafeNode } from "./index";
import { describe, expect, it } from "@jest/globals";

describe("getTypeSafeNode", () => {
  const FunctionDeclarationNode = functionDeclaration(
    identifier("test"),
    [],
    blockStatement([]),
    false,
    false
  );

  const NonFunctioningFunctionDeclarationNode = {
    ...FunctionDeclarationNode,
    type: "FuNKtioNDeClArAtiOnz!",
  };

  it("should work", () => {
    expect(() =>
      getTypeSafeNode(FunctionDeclarationNode, "FunctionDeclaration")
    ).not.toThrow();
  });

  it.each([
    [null],
    [undefined],
    [""],
    [{}],
    [NonFunctioningFunctionDeclarationNode],
  ])("should throw if node is '%s'", (node: any) => {
    expect(() => getTypeSafeNode(node, "FunctionDeclaration")).toThrow();
  });
});
