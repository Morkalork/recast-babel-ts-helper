import { File } from "@babel/types";
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
export declare const generateAstFromCode: (code: string) => File;
