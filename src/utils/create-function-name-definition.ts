import { Node } from "@babel/types";
import { FunctionParameter } from "../parse-function-or-class-name/types";

export const createFunctionNameDefinition = (options: {
  name: string;
  parameters: FunctionParameter[];
  node: Node;
  isClass?: boolean;
  isDefault?: boolean;
  isOptional?: boolean;
}) => ({
  name: options.name,
  isClass: options.isClass || false,
  isDefault: options.isDefault || false,
  isOptional: options.isOptional || false,
  parameters: options.parameters,
  node: options.node,
});
