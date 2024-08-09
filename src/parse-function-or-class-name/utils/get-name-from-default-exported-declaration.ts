import { ExportDefaultDeclaration, Expression, isClass } from "@babel/types";
import { FunctionNameDefinition } from "../types";
import { isOfNodeType } from "../../is-of-node-type";

export const getNameFromDefaultExportedDeclaration = (
  defaultExportedDeclaration: ExportDefaultDeclaration
): FunctionNameDefinition => {
  if (
    isOfNodeType<Expression>(
      defaultExportedDeclaration.declaration,
      "Expression"
    )
  ) {
    return {
      name: "default",
      isClass: false,
    };
  }

  if (defaultExportedDeclaration || defaultExportedDeclaration.declaration) {
    return {
      name: "default",
      isClass: false,
    };
  }

  const name =
    ("name" in defaultExportedDeclaration.declaration
      ? (defaultExportedDeclaration.declaration.name as string)
      : defaultExportedDeclaration.declaration.id?.name) || "";

  return {
    name,
    isClass: isClass(defaultExportedDeclaration.declaration),
  };
};
