import { Node } from "@babel/types";
/**
 * Checks if a recast AST Node is a declaration of a given type
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 *
 * const baseNode = ast.program.body[0];
 *
 * if (
 *   isOfNodeType<ExportNamedDeclaration>(
 *     baseNode,
 *     "ExportNamedDeclaration"
 *   )
 * ) {
 *   // this is true (in this example)
 * }
 *
 * @param node A node in a recast AST
 * @param declarationName The name of the node type, usually found in the .type property of the node
 * @returns true if the node is a declaration of the given type, false otherwise
 */
export declare const isOfNodeType: <T extends Node>(node: any, declarationName: string | string[]) => node is T;
