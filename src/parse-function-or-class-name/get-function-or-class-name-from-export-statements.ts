import {
  DeclareExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  Expression,
  Identifier,
  isClass,
  Statement,
  VariableDeclaration,
} from "@babel/types";
import { getTypeSafeNode } from "../get-type-safe-node";
import { FunctionNameDefinition } from "./types";
import { isDeclarationOf } from "../is-declaration-of";

const getFunctionOrClassNameFromDefaultExportStatement = (
  defaultExportedDeclaration: ExportDefaultDeclaration
): FunctionNameDefinition => {
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

  const name =
    ("name" in defaultExportedDeclaration.declaration
      ? (defaultExportedDeclaration.declaration.name as string)
      : defaultExportedDeclaration.declaration.id?.name) || "";

  return {
    name,
    isClass: isClass(defaultExportedDeclaration.declaration),
  };
};

const getFunctionOrClassNameFromExportStatement = (
  exportedFunction:
    | ExportDefaultSpecifier
    | ExportNamespaceSpecifier
    | ExportSpecifier
): FunctionNameDefinition => {
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

  const exportedFunctionNames: FunctionNameDefinition[] = [];
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
    const namedExportedFunction = exportedFunction as ExportNamedDeclaration;
    if (namedExportedFunction.specifiers) {
      namedExportedFunction.specifiers.forEach((specifier) => {
        const exportedFunction =
          getFunctionOrClassNameFromExportStatement(specifier);
        exportedFunctionNames.push(exportedFunction);
      });
    } else if (namedExportedFunction.declaration) {
      if (
        !isDeclarationOf<Expression>(
          namedExportedFunction.declaration,
          "Expression"
        )
      ) {
        if (
          isDeclarationOf<VariableDeclaration>(
            namedExportedFunction.declaration,
            "VariableDeclaration"
          )
        ) {
          namedExportedFunction.declaration.declarations.forEach(
            (declaration) => {
              const name = declaration.id.toString();
              if (name) {
                exportedFunctionNames.push({
                  name,
                  isClass: isClass(declaration),
                });
              }
            }
          );
        } else {
          const declaration = namedExportedFunction.declaration;
          if (
            isDeclarationOf<DeclareExportAllDeclaration>(
              declaration,
              "DeclareExportAllDeclaration"
            )
          ) {
          } else {
            if ("id" in declaration) {
              if (isDeclarationOf<Identifier>(declaration.id, "Identifier")) {
                const name = declaration.id.name;
                if (name) {
                  exportedFunctionNames.push({
                    name,
                    isClass: isClass(declaration),
                  });
                }
              } else {
                exportedFunctionNames.push({
                  name: declaration.id.toString() || "",
                  isClass: isClass(declaration),
                });
              }
            } else {
              // Ignore
            }
          }
        }
      }
    } else {
      throw new Error("This should not be possible!");
    }
  }
  if (
    isDeclarationOf<ExportDefaultDeclaration>(
      exportedFunction.declaration,
      "ExportDefaultDeclaration"
    )
  ) {
    const defaultDeclaration = getTypeSafeNode<ExportDefaultDeclaration>(
      exportedFunction.declaration,
      "ExportDefaultDeclaration"
    );
    if ("id" in defaultDeclaration.declaration) {
      const name = defaultDeclaration.declaration.id?.name;
      if (name) {
        exportedFunctionNames.push({
          name,
          isClass: isClass(defaultDeclaration.declaration),
        });
      }
    } else {
      exportedFunctionNames.push({
        name: "default",
        isClass: isClass(defaultDeclaration.declaration),
      });
    }
  }

  return exportedFunctionNames;
};
