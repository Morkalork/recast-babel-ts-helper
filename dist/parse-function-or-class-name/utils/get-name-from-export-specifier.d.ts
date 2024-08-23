import { ExportDefaultSpecifier, ExportNamespaceSpecifier, ExportSpecifier } from "@babel/types";
import { FunctionNameDefinition } from "../types";
export declare const getNameFromExportSpecifier: (exportedFunction: ExportDefaultSpecifier | ExportNamespaceSpecifier | ExportSpecifier) => FunctionNameDefinition;
