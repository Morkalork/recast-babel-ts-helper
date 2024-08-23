import { Node } from "@babel/types";
import { FunctionParameter } from "../parse-function-or-class-name/types";
export declare const createFunctionNameDefinition: (options: {
    name: string;
    parameters: FunctionParameter[];
    node: Node;
    isClass?: boolean;
    isDefault?: boolean;
    isOptional?: boolean;
}) => {
    name: string;
    isClass: boolean;
    isDefault: boolean;
    isOptional: boolean;
    parameters: FunctionParameter[];
    node: Node;
};
