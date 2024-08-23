import { ExportDefaultDeclaration, Expression, isClass } from "@babel/types";
import { FunctionNameDefinition } from "../types";
import { isOfNodeType } from "../../is-of-node-type";
import { createFunctionNameDefinition } from "../../utils/create-function-name-definition";
import { getParametersFromNode } from "./get-parameters-from-node";

export const getNameFromDefaultExportedDeclaration = (
  defaultExportedDeclaration: ExportDefaultDeclaration
): FunctionNameDefinition => {
  if (
    isOfNodeType<Expression>(
      defaultExportedDeclaration.declaration,
      "Expression"
    )
  ) {
    return createFunctionNameDefinition({
      name: "default",
      isDefault: true,
      node: defaultExportedDeclaration.declaration,
      parameters: getParametersFromNode(defaultExportedDeclaration.declaration),
    });
  }

  if (defaultExportedDeclaration || defaultExportedDeclaration.declaration) {
    let name = "default";

    if ("id" in defaultExportedDeclaration.declaration) {
      name = defaultExportedDeclaration.declaration.id?.name || "";
    }

    return createFunctionNameDefinition({
      name,
      isClass: isClass(defaultExportedDeclaration.declaration),
      isDefault: true,
      node: defaultExportedDeclaration.declaration,
      parameters: getParametersFromNode(defaultExportedDeclaration.declaration),
    });
  }

  const name =
    ("name" in defaultExportedDeclaration.declaration
      ? (defaultExportedDeclaration.declaration.name as string)
      : defaultExportedDeclaration.declaration.id?.name) || "";

  return createFunctionNameDefinition({
    name,
    isClass: isClass(defaultExportedDeclaration.declaration),
    isDefault: true,
    node: defaultExportedDeclaration.declaration,
    parameters: getParametersFromNode(defaultExportedDeclaration.declaration),
  });
};
