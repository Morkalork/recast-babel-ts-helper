# Recast Babel TS Helper

This is a package that helps you to select nodes when working with extensions in VS Code and Recast.

Basic usage may look like this:

Install:

```node
npm install --save recast-babel-ts-helper
```

Usage:



To see a bit of what you can do, visit the examples in `/examples/examples.test.ts`. Run the tests with the `npm run test-examples`.

## What and why is this?

I'm created this library because I am working with VS Code extensions and I kept writing clunky code to locate nodes with full type safety.

## Typical usage

A standard usage case could be to rename a function in your code. In the following example we want to rename "myFunction" to "yourFunction":

```ts
import {
  generateAstFromCode,
  generateCodeFromAST,
  getTypeSafeNode,
  isOfNodeType,
} from "recast-babel-ts-helper";
import { ExportNamedDeclaration, VariableDeclaration } from "@babel/types";

const code = `export const myFunction = (a: number, b: number): number => a + b;`;
const ast = generateAstFromCode(code);

const baseNode = ast.program.body[0];

const exportNamedDeclarationNode = getTypeSafeNode<ExportNamedDeclaration>(
  baseNode,
  "ExportNamedDeclaration"
);

if (
  isOfNodeType<VariableDeclaration>(
    exportNamedDeclarationNode.declaration,
    "VariableDeclaration"
  )
) {
  const variableDeclaration = getTypeSafeNode<VariableDeclaration>(
    exportNamedDeclarationNode.declaration,
    "VariableDeclaration"
  );
  if ("name" in variableDeclaration.declarations[0].id) {
    variableDeclaration.declarations[0].id.name = "yourFunction";
  }
}

const newCode = generateCodeFromAST(ast);

console.log(newCode);

// export const yourFunction = (a: number, b: number): number => a + b;
```

Another case can be when you want to examine name och parameters for a piece of code:

```ts
import { parseFunctionOrClass } from "recast-babel-ts-helper";

const exampleCode = "export const makeStatement = () => 'hello world';";
const results = parseFunctionOrClass(exampleCode);

expect(results).toHaveLength(1);
expect(results[0].name).toBe("makeStatement");
expect(results[0].isDefault).toBe(false);
```

In this case, the `parseFunctionOrClass` function returns an array of objects representing the exports. One entry for each export with information about their name, type and parameters.

The package exposes the following functions:

```
generateCodeFromAST
generateAstFromCode
isOfNodeType
getTypeSafeNode
parseFunctionOrClass
```

## Can I help?

Yes, please. I've designed this lib very much for my current needs. If you want to help expand upon it, please put up a PR and I'll have a look at it as soon as I can.

## How do I set it up?

```node
// Install
npm i

// build
npm run build

// Test
npm t
```
