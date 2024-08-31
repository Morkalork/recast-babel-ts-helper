import { File } from "@babel/types";
import { FunctionNameDefinition } from "./types";
/**
 * This function takes in a string of code or an AST and returns the name of the function or class, and a boolean indicating if it is a class.
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 *
 * const results = parseFunctionOrClass(ast);
 *
 * const node = results[0];
 * const parameters = node.parameters;
 *
 * // [{"name":"a","type":"number","tsType":"TSNumberKeyword","isOptional":false},{"name":"b","type":"number","tsType":"TSNumberKeyword","isOptional":false}]
 *
 * @param code Either a string representation of the code to parse, or an AST of the code.
 * @returns A FunctionNameDefinition object with the name of the function or class, and a boolean indicating if it is a class.
 * @throws Error if the code does not correspond to a standard AST, or if the code does not contain a function or class.
 */
export declare const parseFunctionOrClass: (code: string | File) => FunctionNameDefinition[];
