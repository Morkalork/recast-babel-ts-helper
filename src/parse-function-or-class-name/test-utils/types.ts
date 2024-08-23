import { FunctionParameter } from "../types";

export type DeclarationTemplate = {
  name: string | string[];
  isClass: boolean;
  code: string;
  hasNoExport?: boolean;
  parameters?: Record<string, FunctionParameter[]>;
};