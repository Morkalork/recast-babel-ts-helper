import {
  ExportDefaultSpecifier,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  Identifier,
} from "@babel/types";
import { isOfNodeType } from "../../is-of-node-type";
import { FunctionNameDefinition } from "../types";

export const getNameFromExportSpecifier = (
  exportedFunction:
    | ExportDefaultSpecifier
    | ExportNamespaceSpecifier
    | ExportSpecifier
): FunctionNameDefinition => {
  if (
    isOfNodeType<ExportDefaultSpecifier>(
      exportedFunction,
      "ExportDefaultSpecifier"
    )
  ) {
    return {
      name: exportedFunction.exported.name,
      isClass: false,
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
        name: exportedFunction.exported.name,
        isClass: false,
      };
    }

    return {
      name: "default",
      isClass: false,
    };
  }
};
