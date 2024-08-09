import {
  ClassDeclaration,
  DeclareExportAllDeclaration,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  Expression,
  Identifier,
  isClass,
  ObjectPattern,
  ObjectProperty,
  Statement,
  VariableDeclaration,
} from "@babel/types";
import { getTypeSafeNode } from "../get-type-safe-node";
import { FunctionNameDefinition } from "./types";
import { isOfNodeType } from "../is-of-node-type";
import { getNameFromExportSpecifier } from "./utils/get-name-from-export-specifier";
import { getNameFromDefaultExportedDeclaration } from "./utils/get-name-from-default-exported-declaration";

export const getFunctionOrClassNameFromExportStatements = (
  statement: Statement
): FunctionNameDefinition[] => {
  const exportedFunctionNames: FunctionNameDefinition[] = [];

  const exportedFunction = getTypeSafeNode<
    ExportNamedDeclaration | ExportDefaultDeclaration | ExportAllDeclaration
  >(statement, statement.type);
  if (
    isOfNodeType<ExportDefaultDeclaration>(
      exportedFunction,
      "ExportDefaultDeclaration"
    )
  ) {
    exportedFunctionNames.push(
      getNameFromDefaultExportedDeclaration(exportedFunction)
    );
  }

  if (
    isOfNodeType<ExportNamedDeclaration>(
      exportedFunction,
      "ExportNamedDeclaration"
    )
  ) {
    const namedExportedFunction = exportedFunction as ExportNamedDeclaration;
    if (
      namedExportedFunction.specifiers &&
      namedExportedFunction.specifiers.length > 0
    ) {
      namedExportedFunction.specifiers.forEach((specifier) => {
        if (
          !isOfNodeType<
            ExportSpecifier | ExportDefaultSpecifier | ExportNamespaceSpecifier
          >(specifier, [
            "ExportSpecifier",
            "ExportDefaultSpecifier",
            "ExportNamespaceSpecifier",
          ])
        ) {
          const exportedFunction = getNameFromExportSpecifier(specifier);
          exportedFunctionNames.push(exportedFunction);
        } else {
          const exportedFunction = specifier.type;
          console.log(exportedFunction);
        }
      });
    } else if (namedExportedFunction.declaration) {
      if (
        !isOfNodeType<Expression>(
          namedExportedFunction.declaration,
          "Expression"
        )
      ) {
        if (
          isOfNodeType<VariableDeclaration>(
            namedExportedFunction.declaration,
            "VariableDeclaration"
          )
        ) {
          namedExportedFunction.declaration.declarations.forEach(
            (declaration) => {
              if (isOfNodeType<Identifier>(declaration.id, "Identifier")) {
                exportedFunctionNames.push({
                  name: declaration.id.name,
                  isClass: isClass(declaration),
                });
              } else if (
                isOfNodeType<ObjectPattern>(declaration.id, "ObjectPattern")
              ) {
                declaration.id.properties.forEach((property) => {
                  if (
                    isOfNodeType<ObjectProperty>(property, "ObjectProperty")
                  ) {
                    if (isOfNodeType<Identifier>(property.key, "Identifier")) {
                      exportedFunctionNames.push({
                        name: property.key.name,
                        isClass: isClass(declaration),
                      });
                    }
                  }
                });
              } else {
                const name = declaration.id.toString();
                if (name) {
                  exportedFunctionNames.push({
                    name,
                    isClass: isClass(declaration),
                  });
                }
              }
            }
          );
        } else if (
          isOfNodeType<ClassDeclaration>(
            namedExportedFunction.declaration,
            "ClassDeclaration"
          )
        ) {
          const declarationName = namedExportedFunction.declaration.id?.name;
          const forcedIdentifierName =
            namedExportedFunction.declaration.id?.toString();
          const name = declarationName || forcedIdentifierName || "";

          if (!name) {
            throw new Error("Could not identify node name");
          }

          exportedFunctionNames.push({
            name,
            isClass: true,
          });
        } else {
          const declaration = namedExportedFunction.declaration;
          if (
            isOfNodeType<DeclareExportAllDeclaration>(
              declaration,
              "DeclareExportAllDeclaration"
            )
          ) {
          } else {
            if (declaration && "id" in declaration) {
              if (isOfNodeType<Identifier>(declaration.id, "Identifier")) {
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
    } else if (
      isOfNodeType<ExportAllDeclaration>(
        exportedFunction,
        "ExportAllDeclaration"
      )
    ) {
      // Ignore
    } else {
      throw new Error("This should not be possible!");
    }
  }

  /**
  if (
    isOfNodeType<ExportDefaultDeclaration>(
      exportedFunction.declaration,
      "ExportDefaultDeclaration"
    )
  ) {
    const defaultDeclaration = getTypeSafeNode<ExportDefaultDeclaration>(
      exportedFunction.declaration,
      "ExportDefaultDeclaration"
    );
    if (
      defaultDeclaration.declaration &&
      "id" in defaultDeclaration.declaration
    ) {
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
     */

  return exportedFunctionNames;
};
