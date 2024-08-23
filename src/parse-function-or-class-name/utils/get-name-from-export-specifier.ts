import {
  ExportDefaultSpecifier,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  Identifier,
} from "@babel/types";
import { isOfNodeType } from "../../is-of-node-type";
import { FunctionNameDefinition } from "../types";
import { createFunctionNameDefinition } from "../../utils/create-function-name-definition";
import { getParametersFromNode } from "./get-parameters-from-node";

export const getNameFromExportSpecifier = (
  exportedFunction:
    | ExportDefaultSpecifier
    | ExportNamespaceSpecifier
    | ExportSpecifier
): FunctionNameDefinition => {
  const functionNameDefinition = createFunctionNameDefinition({
    name: "",
    node: exportedFunction,
    parameters: []
  });

  if (
    isOfNodeType<ExportDefaultSpecifier>(
      exportedFunction,
      "ExportDefaultSpecifier"
    )
  ) {
    return {
      ...functionNameDefinition,
      name: exportedFunction.exported.name,
      isDefault: true,
    };
  }

  if (
    isOfNodeType<ExportSpecifier>(exportedFunction, "ExportSpecifier") ||
    isOfNodeType<ExportNamespaceSpecifier>(
      exportedFunction,
      "ExportNamespaceSpecifier"
    )
  ) {
    if (isOfNodeType<Identifier>(exportedFunction.exported, "Identifier")) {
      return {
        ...functionNameDefinition,
        name: exportedFunction.exported.name,
      };
    }

    return {
      ...functionNameDefinition,
      name: "default",
      isDefault: true,
    };
  }
};
