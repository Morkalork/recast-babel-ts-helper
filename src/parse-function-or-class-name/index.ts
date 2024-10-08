import { File } from "@babel/types";
import { generateAstFromCode } from "../generate-ast-from-code";
import { getFunctionOrClassNameFromExportStatements } from "./get-function-or-class-name-from-export-statements";
import { FunctionNameDefinition } from "./types";

/**
 * This function takes in a string of code or an AST and returns the name of the function or class, and a boolean indicating if it is a class.
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 *
 * const results = parseFunctionOrClass(ast);
 *
 * const node = results[0];
 * const parameters = node.parameters;
 *
 * // [{"name":"a","type":"number","tsType":"TSNumberKeyword","isOptional":false},{"name":"b","type":"number","tsType":"TSNumberKeyword","isOptional":false}]
 *
 * @param code Either a string representation of the code to parse, or an AST of the code.
 * @returns A FunctionNameDefinition object with the name of the function or class, and a boolean indicating if it is a class.
 * @throws Error if the code does not correspond to a standard AST, or if the code does not contain a function or class.
 */
export const parseFunctionOrClass = (
  code: string | File
): FunctionNameDefinition[] => {
  const ast: File = typeof code === "string" ? generateAstFromCode(code) : code;

  const exportStatements = ast.program.body.filter(
    (bodyPart: { type: string }) =>
      bodyPart.type === "ExportNamedDeclaration" ||
      bodyPart.type === "ExportDefaultDeclaration"
  );

  const hasTooFewExports = exportStatements.length < 1;
  if (hasTooFewExports) {
    return [];
  }

  const acceptableExportedTypes = [
    "ExportNamedDeclaration",
    "ExportDefaultDeclaration",
  ];

  if (!acceptableExportedTypes.includes(exportStatements[0].type)) {
    // TODO: is this me being anal retentive? Can this never happen?
    throw new Error(
      "This extension only works with named or default exports. Please add a named or default export to the function or class."
    );
  }

  return exportStatements
    .map((statement) => getFunctionOrClassNameFromExportStatements(statement))
    .flat();
};
