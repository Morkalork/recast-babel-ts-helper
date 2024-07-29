import { Options, prettyPrint } from "recast";
import { File } from "@babel/types";

/**
 * Generates a code string from a recast AST
 *
 * @param ast An AST that has been generated from a code string using recast
 * @param options Options for pretty printing the code
 * @returns A string representing the code in the AST
 */
export const generateCodeFromAST = (ast: File, options?: Options): string =>
  prettyPrint(ast, options).code;
