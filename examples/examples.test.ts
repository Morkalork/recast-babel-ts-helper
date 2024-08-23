import { parseFunctionOrClass } from "../src/parse-function-or-class-name/index";

describe("examples", () => {
  it("should handle a standard export", () => {
    const exampleCode = "export const makeStatement = () => 'hello world';";
    const results = parseFunctionOrClass(exampleCode);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("makeStatement");
    expect(results[0].isDefault).toBe(false);
  });

  it("should handle a default class export", () => {
    const exampleCode = "export default class MakeStatement {}";
    const results = parseFunctionOrClass(exampleCode);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("MakeStatement");
    expect(results[0].isClass).toBe(true);
    expect(results[0].isDefault).toBe(true);
  });

  it("should return the correct parameters from a function", () => {
    const exampleCode = `
      export const makeStatement = (name: string, age?: number) => {
        return 'hello world';
      };
    `;

    const results = parseFunctionOrClass(exampleCode);

    expect(results[0].parameters).toHaveLength(2);
    expect(results[0].parameters[0].name).toBe("name");
    expect(results[0].parameters[0].type).toBe("string");
    expect(results[0].parameters[0].isOptional).toBe(false);
    expect(results[0].parameters[1].name).toBe("age");
    expect(results[0].parameters[1].type).toBe("number");
    expect(results[0].parameters[1].isOptional).toBe(true);
  });

  it("should return the correct data from a class", () => {
    const exampleCode = `
      export class MakeStatement {
        constructor(name: string, age?: number) {}
      }
    `;

    const result = parseFunctionOrClass(exampleCode);
    expect(result[0].name).toBe("MakeStatement");
    expect(result[0].isClass).toBe(true);
    expect(result[0].parameters).toHaveLength(2);
    expect(result[0].parameters[0].name).toBe("name");
    expect(result[0].parameters[0].type).toBe("string");
    expect(result[0].parameters[0].isOptional).toBe(false);
    expect(result[0].parameters[1].name).toBe("age");
    expect(result[0].parameters[1].type).toBe("number");
    expect(result[0].parameters[1].isOptional).toBe(true);
  });
});
