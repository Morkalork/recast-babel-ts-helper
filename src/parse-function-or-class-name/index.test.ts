import { describe, expect, it } from "@jest/globals";
import { parseFunctionOrClassName } from ".";
import { FunctionNameDefinition } from "./types";

const validateResult = (
  result: FunctionNameDefinition[],
  expectedName: string,
  expectedIsClass: boolean
) => {
  expect(result).toHaveLength(1);
  const functionOrClass = result[0];
  expect(functionOrClass.name).toBe(expectedName);
  expect(functionOrClass.isClass).toBe(expectedIsClass);
};

describe("getFunctionOrClassName", () => {
  it("should handle code with no exports", () => {
    const code = `
      const test = () => {};
    `;
    const result = parseFunctionOrClassName(code);
    expect(result).toHaveLength(0);
  });

  it('should throw if unacceptable exports are presented', () => {
    const code = `
      const foo = () => {};
      const bar = () => {};
      export { foo, bar };
    `;
    const result = parseFunctionOrClassName(code);
    expect(result).toHaveLength(2);
  })

  it("should handle multiple exports", () => {
    const code = `
      export const test = () => {};
      export class TestClass {};
    `;
    const result = parseFunctionOrClassName(code);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("test");
    expect(result[0].isClass).toBe(false);
    expect(result[1].name).toBe("TestClass");
    expect(result[1].isClass).toBe(true);
  });
});
