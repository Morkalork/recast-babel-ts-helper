import { Declaration, Expression, VariableDeclarator } from "@babel/types";
import { FunctionParameter } from "../types";
export declare const getParametersFromNode: (node: Declaration | VariableDeclarator | Expression) => FunctionParameter[];
