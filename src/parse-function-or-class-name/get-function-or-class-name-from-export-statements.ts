import {
  ExportDefaultDeclaration,
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  Expression,
  Identifier,
  isClass,
  Statement,
} from "@babel/types";
import { getTypeSafeNode } from "../get-type-safe-node";
import { FunctionNameDefinition } from "./types";
import { isDeclarationOf } from "../is-declaration-of";

const getFunctionOrClassNameFromDefaultExportStatement = (
  defaultExportedDeclaration: ExportDefaultDeclaration
) => {
  if (
    isDeclarationOf<Expression>(
      defaultExportedDeclaration.declaration,
      "Expression"
    )
  ) {
    return {
      name: "default",
      isClass: false,
    };
  }

  return {
    name: defaultExportedDeclaration.declaration.id?.name || "",
    isClass: isClass(defaultExportedDeclaration.declaration),
  };
};

const getFunctionOrClassNameFromExportStatement = (
  exportedFunction:
    | ExportDefaultSpecifier
    | ExportNamespaceSpecifier
    | ExportSpecifier
) => {
  if (
    isDeclarationOf<ExportDefaultSpecifier>(
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
    isDeclarationOf<ExportSpecifier>(exportedFunction, "ExportSpecifier") ||
    isDeclarationOf<ExportNamespaceSpecifier>(
      exportedFunction,
      "ExportNamespaceSpecifier"
    )
  ) {
    if (isDeclarationOf<Identifier>(exportedFunction.exported, "Identifier")) {
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

export const getFunctionOrClassNameFromExportStatements = (
  statement: Statement
): FunctionNameDefinition[] => {
  const exportedFunction = getTypeSafeNode<
    ExportNamedDeclaration | ExportDefaultDeclaration
  >(
    statement,
    statement.type === "ExportNamedDeclaration"
      ? "ExportNamedDeclaration"
      : "ExportDefaultDeclaration"
  );

  const exportedFunctionNames = [];
  if (
    isDeclarationOf<ExportDefaultDeclaration>(
      exportedFunction,
      "ExportDefaultDeclaration"
    )
  ) {
    exportedFunctionNames.push(
      getFunctionOrClassNameFromDefaultExportStatement(exportedFunction)
    );
  }

  if (
    isDeclarationOf<ExportNamedDeclaration>(
      exportedFunction,
      "ExportNamedDeclaration"
    )
  ) {
    if (
      isDeclarationOf<ExportDefaultDeclaration>(
        exportedFunction.declaration,
        "ExportDefaultDeclaration"
      )
    ) {
    } else {
      exportedFunction.declaration.declarations.forEach((declaration) => {});

      const names = exportedFunction.specifiers.map((specifier) =>
        getFunctionOrClassNameFromExportStatement(specifier)
      );
      exportedFunctionNames.push(names);
    }
  }
  const namedExportedFunction = exportedFunction as ExportNamedDeclaration;
  if (namedExportedFunction.specifiers) {
    namedExportedFunction.specifiers.forEach((specifier) => {
      const exportedFunction =
        getFunctionOrClassNameFromExportStatement(specifier);
      exportedFunctionNames.push(exportedFunction);
    });
  }

  return exportedFunctionNames;
};
