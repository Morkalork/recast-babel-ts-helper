import { File } from "@babel/types";
import { parse } from "recast";

/**
 * Generates an AST from a string of code
 *
 * @param code A string of code to generate an AST from
 * @returns An AST of the code
 */
export const generateAstFromCode = (code: string): File => {
  return parse(code, {
    parser: require("recast/parsers/babel-ts"),
  }) as File;
};
