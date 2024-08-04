import { DeclarationTemplate } from "./types";

/**
 * SINGLE EXPORTS
 */
export const noExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null`,
  hasNoExport: true,
};
export const fatArrowExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export const makeStatement = () => null`,
};
export const functionExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export function makeStatement() {}`,
};
export const generatorFunctionExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export function* makeStatement() {}`,
};
export const asyncFunctionExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export async function makeStatement() {}`,
};
export const listFunctionRenameExport: DeclarationTemplate = {
  name: "myStatement",
  isClass: false,
  code: `const makeStatement = () => null; export const { myStatement } = makeStatement;`,
};
export const classExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: true,
  code: `export class makeStatement {}`,
};
export const defaultExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement`,
};
export const namedExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement }`,
};
export const fatArrowExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export const makeStatement = (a: number, b: string) => null`,
};
export const functionExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `export function makeStatement(a: numbmyStatementer, b: string) {}`,
};
export const classExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: true,
  code: `export class makeStatement { constructor(a: number, b: string) {} }`,
};
export const namedExportWithAlias: DeclarationTemplate = {
  name: "myStatement",
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement as myStatement }`,
};

/**
 * MULTIPLE EXPORTS
 */
export const namedExportWithMultipleAliases: DeclarationTemplate = {
  name: ["myStatement", "yourStatement"],
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as yourStatement }`,
};
export const namedExportWithAliasAndDefault: DeclarationTemplate = {
  name: ["myStatement", "default"],
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as default }`,
};
export const namedExportWithMultipleAliasesAndDefault: DeclarationTemplate = {
  name: ["myStatement", "yourStatement", "default"],
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default }`,
};
export const mixedExport: DeclarationTemplate = {
  name: ["makeStatement", "default"],
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement }`,
};
export const mixedExportWithAlias: DeclarationTemplate = {
  name: ["makeStatement", "myStatement", "myStatement"],
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement }`,
};
export const mixedExportWithMultipleAliases: DeclarationTemplate = {
  name: ["makeStatement", "myStatement", "myStatement", "yourStatement"],
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as yourStatement }`,
};
export const mixedExportWithAliasAndDefault: DeclarationTemplate = {
  name: ["makeStatement", "myStatement", "default"],
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as default }`,
};
export const mixedExportWithMultipleAliasesAndDefault: DeclarationTemplate = {
  name: ["makeStatement", "myStatement", "yourStatement", "default"],
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default }`,
};
export const mixedExportWithMultipleAliasesAndDefaultAndNamed: DeclarationTemplate =
  {
    name: ["makeStatement", "myStatement", "yourStatement", "default", "named"],
    isClass: false,
    code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default, makeStatement as named }`,
  };
export const mixedExportWithMultipleAliasesAndNoDefaultAndNamed: DeclarationTemplate =
  {
    name: ["myStatement", "yourStatement", "default", "named"],
    isClass: false,
    code: `const makeStatement = () => null; export { makeStatement as myStatement, makeStatement as yourStatement, makeStatement as default, makeStatement as named }`,
  };

/**
 * MISC
 */
export const exportImportedExportFunction: DeclarationTemplate = {
  name: "Foo",
  isClass: false,
  code: `import { Foo } from "./export-declaration-templates.additional"; export { Foo }`,
};
export const exportImportImmediatelyFunction: DeclarationTemplate = {
  name: "Foo",
  isClass: false,
  code: `export { Foo } from "./export-declaration-templates.additional";`,
};
