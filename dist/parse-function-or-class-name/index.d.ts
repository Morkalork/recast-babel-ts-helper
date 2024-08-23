import { File } from "@babel/types";
import { FunctionNameDefinition } from "./types";
/**
 * This function takes in a string of code or an AST and returns the name of the function or class, and a boolean indicating if it is a class.
 *
 * @param code Either a string representation of the code to parse, or an AST of the code.
 * @returns A FunctionNameDefinition object with the name of the function or class, and a boolean indicating if it is a class.
 * @throws Error if the code does not correspond to a standard AST, or if the code does not contain a function or class.
 */
export declare const parseFunctionOrClass: (code: string | File) => FunctionNameDefinition[];
