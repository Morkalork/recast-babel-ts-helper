import { Node } from "@babel/types";
/**
 * Checks if a recast AST Node is a declaration of a given type
 *
 * @param node A node in a recast AST
 * @param declarationName The name of the node type, usually found in the .type property of the node
 * @returns true if the node is a declaration of the given type, false otherwise
 */
export declare const isOfNodeType: <T extends Node>(node: any, declarationName: string | string[]) => node is T;
