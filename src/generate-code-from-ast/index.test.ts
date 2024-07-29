import { generateAstFromCode } from "../generate-ast-from-code";
import { generateCodeFromAST } from "./index";
import { describe, expect, it } from "@jest/globals";

describe("generateCodeFromAST", () => {
  it("should work", () => {
    const code = 'export const test = () => "hello world!"';
    const ast = generateAstFromCode(code);
    const generatedCode = generateCodeFromAST(ast);
    expect(generatedCode).toContain(code);
  });
});
