import { File } from "@babel/types";
import { parse } from "recast";

/**
 * Generates an AST from a string of code
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 * 
 * @param code A string of code to generate an AST from
 * @returns An AST of the code
 */
export const generateAstFromCode = (code: string): File => {
  return parse(code, {
    parser: require("recast/parsers/babel-ts"),
  }) as File;
};
