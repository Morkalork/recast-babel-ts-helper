# Recast Babel TS Helper

This is a package that helps you to select nodes when working with extensions in VS Code and Recast.

Basic usage may look like this:

Install:
```node
npm install --save recast-babel-ts-helper
```

Usage:
```ts
const exampleCode = "export const makeStatement = () => 'hello world';";
const results = parseFunctionOrClassName(exampleCode);

expect(results).toHaveLength(1);
expect(results[0].name).toBe("makeStatement");
expect(results[0].isDefault).toBe(false);
```

To see a bit of what you can do, visit the examples in `/examples/examples.test.ts`. Run the tests with the `npm run test-examples`.

## What and why is this?

I'm created this library because I am working with VS Code extensions and I kept writing clunky code to locate nodes with full type safety.


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