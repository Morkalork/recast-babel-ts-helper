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
  FunctionExpression,
  Identifier,
  isClass,
  ObjectPattern,
  ObjectProperty,
  Statement,
  TSType,
  VariableDeclaration,
} from "@babel/types";
import { getTypeSafeNode } from "../get-type-safe-node";
import { FunctionNameDefinition, FunctionParameter } from "./types";
import { isOfNodeType } from "../is-of-node-type";
import { getNameFromExportSpecifier } from "./utils/get-name-from-export-specifier";
import { getNameFromDefaultExportedDeclaration } from "./utils/get-name-from-default-exported-declaration";
import { createFunctionNameDefinition } from "../utils/create-function-name-definition";
import { getParametersFromNode } from "./utils/get-parameters-from-node";

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
          // TODO: Handle this case
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
                exportedFunctionNames.push(
                  createFunctionNameDefinition({
                    name: declaration.id.name,
                    isClass: isClass(declaration),
                    node: declaration,
                    parameters: getParametersFromNode(declaration),
                  })
                );
              } else if (
                isOfNodeType<ObjectPattern>(declaration.id, "ObjectPattern")
              ) {
                declaration.id.properties.forEach((property) => {
                  if (
                    isOfNodeType<ObjectProperty>(property, "ObjectProperty")
                  ) {
                    if (isOfNodeType<Identifier>(property.key, "Identifier")) {
                      exportedFunctionNames.push(
                        createFunctionNameDefinition({
                          name: property.key.name,
                          isClass: isClass(declaration),
                          node: declaration,
                          parameters: getParametersFromNode(declaration),
                        })
                      );
                    }
                  }
                });
              } else {
                const name = declaration.id.toString();
                if (name) {
                  exportedFunctionNames.push(
                    createFunctionNameDefinition({
                      name,
                      isClass: isClass(declaration),
                      node: declaration,
                      parameters: getParametersFromNode(declaration),
                    })
                  );
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

          exportedFunctionNames.push(
            createFunctionNameDefinition({
              name,
              isClass: true,
              node: namedExportedFunction.declaration,
              parameters: getParametersFromNode(namedExportedFunction.declaration),
            })
          );
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
                  exportedFunctionNames.push(
                    createFunctionNameDefinition({
                      name,
                      isClass: isClass(declaration),
                      node: declaration,
                      parameters: getParametersFromNode(declaration),
                    })
                  );
                }
              } else {
                exportedFunctionNames.push(
                  createFunctionNameDefinition({
                    name: declaration.id.toString() || "",
                    isClass: isClass(declaration),
                    node: declaration,
                    parameters: getParametersFromNode(declaration),
                  })
                );
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

  return exportedFunctionNames;
};
