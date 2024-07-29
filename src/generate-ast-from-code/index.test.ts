import { generateAstFromCode } from "./index";
import { describe, expect, it } from "@jest/globals";

describe("generateAstFromCode", () => {
  it("should work", () => {
    const code = "export const test = () => 'hello world!'";
    const ast = generateAstFromCode(code);
    expect(ast).not.toBeNull();
    expect(ast.program.body.length).toBe(1);
    expect(ast.program.body[0].type).toBe("ExportNamedDeclaration");
  });
});
