import { getFunctionOrClassNameFromExportStatements } from "./get-function-or-class-name-from-export-statements";
import { describe, expect, it } from "@jest/globals";
import { ExportNamedDeclaration, ExportSpecifier } from "@babel/types";
import * as testCases from "./test-utils/export-declaration-templates";
import { generateAstFromCode } from "../generate-ast-from-code";

describe("getFunctionOrClassNameFromExportStatements", () => {
  it("should work", () => {
    const exportSpecifier: ExportSpecifier = {
      type: "ExportSpecifier",
      exported: {
        type: "Identifier",
        name: "makeStatement",
      },
      local: {
        type: "Identifier",
        name: "localMakeStatement",
      },
    };
    const declaration: ExportNamedDeclaration = {
      type: "ExportNamedDeclaration",
      specifiers: [exportSpecifier],
    };

    const results = getFunctionOrClassNameFromExportStatements(declaration);
    const result = results[0];
    expect(result).not.toBeNull();
    expect(result.name).toBe("makeStatement");
  });

  it.each(Object.values(testCases))(
    "should handle '$code'",
    ({ code, name, hasNoExport }) => {
      const ast = generateAstFromCode(code);
      const statements = ast.program.body.filter((bodyPart) =>
        bodyPart.type.startsWith("Export")
      );
      statements.forEach((statement) => {
        if (hasNoExport) {
          expect(() =>
            getFunctionOrClassNameFromExportStatements(statement)
          ).toThrowError();
        } else {
          const names = Array.isArray(name) ? name : [name];
          const results = getFunctionOrClassNameFromExportStatements(statement);
          results.forEach((result) => {
            expect(names).toContain(result.name);
          });
        }
      });
    }
  );
});
