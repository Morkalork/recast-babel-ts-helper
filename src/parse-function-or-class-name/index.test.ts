import { describe, expect, it } from "@jest/globals";
import * as testCases from "./test-utils/export-declaration-templates";
import { parseFunctionOrClassName } from ".";
import { generateAstFromCode } from "../generate-ast-from-code";
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
  type CodeTestProps = {
    name: string;
    isClass: boolean;
    code: string;
  };

  it.each<CodeTestProps>`
    name           | isClass  | code
    ${"test"}      | ${false} | ${"export const test = () => {};"}
    ${"test"}      | ${false} | ${"export function test() {};"}
    ${"test"}      | ${false} | ${"export const test = function() {};"}
    ${"test"}      | ${false} | ${"export const test = function test() {};"}
    ${"test"}      | ${false} | ${"export const test = () => {};"}
    ${"test"}      | ${false} | ${"export const test = class {};"}
    ${"TestClass"} | ${false} | ${"export const TestClass = class {}; // This is a class expression, not a class declaration"}
    ${"TestClass"} | ${true}  | ${"export class TestClass {};"}
  `(
    "should return name $name and isClass $isClass for $code",
    ({ name, isClass, code }) => {
      validateResult(parseFunctionOrClassName(code), name, isClass);
    }
  );

  it("should handle all described cases", () => {
    Object.entries(testCases).forEach(
      ([key, { name, isClass, hasNoExport, code }]) => {
        const hasMultipleExports = Array.isArray(name) && name.length > 1;

        if (hasMultipleExports) {
          const results = parseFunctionOrClassName(code);
          expect(results.length).toBeGreaterThan(1);
          results.forEach((result) => {
            expect(result[0].name).toBe(name);
            expect(result[0].isClass).toBe(isClass);
          });
        } else if (hasNoExport) {
          expect(parseFunctionOrClassName(code)).toHaveLength(0);
        } else if (typeof name === "string") {
          validateResult(parseFunctionOrClassName(code), name, isClass);
        }
      }
    );
  });

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
