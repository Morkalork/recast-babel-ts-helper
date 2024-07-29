import { Node } from "@babel/types";
import { isDeclarationOf } from "../is-declaration-of";

/**
 *
 * @param node A node in a recast AST
 * @param declarationName The name of the node type, usually found in the .type property of the node
 * @returns The node casted to the given type
 * @throws Error if the node is undefined, or if the node is not of the given type
 */
export const getTypeSafeNode = <T extends Node>(
  node: Node,
  declarationName: string // TODO: if this can in anyway be inferred from T, that would be great
): T => {
  if (!node) {
    throw new Error("Node is undefined");
  }

  if (node.type !== declarationName) {
    throw new Error(`Expected ${declarationName} but got ${node.type}`);
  }

  if (!isDeclarationOf<T>(node, declarationName)) {
    throw new Error(`Expected node to be of type ${declarationName}`);
  }

  return node;
};
