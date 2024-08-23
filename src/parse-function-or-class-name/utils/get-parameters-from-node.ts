import {
  ClassBody,
  ClassDeclaration,
  ClassMethod,
  Declaration,
  Expression,
  Identifier,
  Pattern,
  RestElement,
  VariableDeclarator,
} from "@babel/types";
import { isOfNodeType } from "../../is-of-node-type";
import { FunctionParameter } from "../types";
import { parseNodeType } from "./parse-node-type";

export const getParametersFromNode = (
  node: Declaration | VariableDeclarator | Expression
): FunctionParameter[] => {
  let params: (Identifier | RestElement | Pattern)[] = [];
  if ("params" in node) {
    params = node.params as Identifier[];
  } else if (
    isOfNodeType<VariableDeclarator>(node, "VariableDeclarator") &&
    node.init &&
    "params" in node.init
  ) {
    params = node.init.params;
  } else if (isOfNodeType<Expression>(node, "Expression")) {
  } else if (isOfNodeType<ClassDeclaration>(node, "ClassDeclaration")) {
    const outerBoddy = node.body;
    if (isOfNodeType<ClassBody>(outerBoddy, "ClassBody")) {
      const innerBodies = outerBoddy.body;
      const classConstructor = innerBodies.find(
        (body) =>
          isOfNodeType<ClassMethod>(body, "ClassMethod") &&
          body.kind === "constructor"
      );
      if (classConstructor) {
        if ("params" in classConstructor) {
          params = classConstructor.params.filter((param) => "name" in param);
        }
      }
    }
  }

  return params
    .filter((params) => "name" in params)
    .map((param) => {
      const type =
        param.typeAnnotation && "typeAnnotation" in param.typeAnnotation
          ? param.typeAnnotation.typeAnnotation.type
          : "TSAnyKeyword";
      return {
        name: param.name,
        type: parseNodeType(type),
        tsType: type,
        isOptional: param.optional || false,
      };
    });
};
