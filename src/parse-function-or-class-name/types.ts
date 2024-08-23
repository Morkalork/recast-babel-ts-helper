import { Node, TSType } from "@babel/types";

/**
 * Represents a parameter in a function or class
 * 
 * @property type The type of the parameter, practically speaking a TSType from @babel/types
 * @property name The name of the parameter
 * @property isOptional Whether the parameter is optional
 */
export type FunctionParameter = {type: string, tsType: string, name: string, isOptional?: boolean};

export type FunctionNameDefinition = {
  name: string;
  isClass: boolean;
  isDefault: boolean;
  parameters: FunctionParameter[];
  node: Node;
};
