import { Node } from "@babel/types";
/**
 * This function takes in a node and a declaration name, and returns the node casted to the given type.
 *
 * @param node A node in a recast AST
 * @param declarationName The name of the node type, usually found in the .type property of the node
 * @returns The node casted to the given type
 * @throws Error if the node is undefined, or if the node is not of the given type
 */
export declare const getTypeSafeNode: <T extends Node>(node: Node, declarationName: string) => T;
