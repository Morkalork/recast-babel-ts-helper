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
  name: "default",
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement`,
};
export const namedExport: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  code: `const makeStatement = () => null; export { makeStatement }`,
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
  name: ["default", "myStatement"],
  isClass: false,
  code: `const makeStatement = () => null; export default makeStatement; export { makeStatement as myStatement }`,
};
export const mixedExportWithMultipleAliases: DeclarationTemplate = {
  name: ["default", "myStatement", "yourStatement"],
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
 * EXPORTS WITH PARAMETERS
 */
export const fatArrowExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  parameters: {
    makeStatement: [
      { name: "a", type: "number", tsType: "", isOptional: false },
      { name: "b", type: "string", tsType: "", isOptional: false },
    ],
  },
  code: `export const makeStatement = (a: number, b: string) => null;`,
};
export const functionExportWithParameters: DeclarationTemplate = {
  name: "makeStatement",
  isClass: false,
  parameters: {
    makeStatement: [
      { name: "a", type: "typeReference", tsType: "", isOptional: false },
      { name: "b", type: "string", tsType: "", isOptional: false },
    ],
  },
  code: `export function makeStatement(a: numbmyStatementer, b: string) {}`,
};
export const classExportWithParameters: DeclarationTemplate = {
  name: ["makeStatement", "MakeStatement"],
  isClass: true,
  parameters: {
    MakeStatement: [
      { name: "a", type: "number", tsType: "", isOptional: false },
      { name: "b", type: "string", tsType: "", isOptional: false },
    ],
  },
  code: `export class MakeStatement { constructor(a: number, b: string) {} }; export const makeStatement = new MakeStatement(5, "hello");`,
};

/**
 * MISC
 */
export const exportImportedExportFunction: DeclarationTemplate = {
  name: ["foo", "bar"],
  isClass: false,
  code: `import { foo } from "./export-all-test-case"; export { foo as bar }`,
};
export const exportImportImmediatelyFunction: DeclarationTemplate = {
  name: ["foo"],
  isClass: false,
  code: `export { foo } from "./export-all-test-case";`,
};
export const exportAllNamed: DeclarationTemplate = {
  name: ["foo", "bar"],
  isClass: false,
  code: `export * from "./export-all-test-case";`,
};

/**
 * React component-like tests
 */
export const exportReactLikeClassComponent: DeclarationTemplate = {
  name: "MyReactClassComponent",
  isClass: true,
  parameters: {
    MyComponent: [
      { name: "a", type: "string", tsType: "", isOptional: false },
      { name: "b", type: "number", tsType: "", isOptional: false },
    ],
  },
  code: `export class MyReactClassComponent { constructor(a: string, b: number) {} };`,
};
export const exportReactLikeFunctionComponent: DeclarationTemplate = {
  name: "MyFunctionalReactComponent",
  isClass: true,
  parameters: {
    MyComponent: [
      { name: "a", type: "string", tsType: "", isOptional: false },
      { name: "b", type: "number", tsType: "", isOptional: false },
    ],
  },
  code: `export const MyFunctionalReactComponent = ({a, b}: {a: string, b: number}) => null;`,
};

export const exportReactLikeFunctionWithSeparateType: DeclarationTemplate = {
  name: "MyFunctionalComponentWithPropType",
  isClass: false,
  parameters: {
    MyFunctionalComponentWithPropType: [
      { name: "a", type: "any", tsType: "", isOptional: false },
      { name: "b", type: "any", tsType: "", isOptional: false },
    ],
  },
  code: `type MyProps = {a: string, b: number}; export const MyFunctionalComponentWithPropType = ({a, b}: MyProps) => null;`,
};
