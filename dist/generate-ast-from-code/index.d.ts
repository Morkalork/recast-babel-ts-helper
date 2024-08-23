import { File } from "@babel/types";
/**
 * Generates an AST from a string of code
 *
 * @param code A string of code to generate an AST from
 * @returns An AST of the code
 */
export declare const generateAstFromCode: (code: string) => File;
