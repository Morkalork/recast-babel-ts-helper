import { Statement } from "@babel/types";
import { FunctionNameDefinition } from "./types";
export declare const getFunctionOrClassNameFromExportStatements: (statement: Statement) => FunctionNameDefinition[];
