export type DeclarationTemplate = {
  name: string | string[];
  isClass: boolean;
  code: string;
  hasNoExport?: boolean;
};