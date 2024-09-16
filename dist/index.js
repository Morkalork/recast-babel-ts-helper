var recast = require('recast');
var types = require('@babel/types');
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var vscode__namespace = /*#__PURE__*/_interopNamespaceDefault(vscode);

/**
 * Checks if a recast AST Node is a declaration of a given type
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 *
 * const baseNode = ast.program.body[0];
 *
 * if (
 *   isOfNodeType<ExportNamedDeclaration>(
 *     baseNode,
 *     "ExportNamedDeclaration"
 *   )
 * ) {
 *   // this is true (in this example)
 * }
 *
 * @param node A node in a recast AST
 * @param declarationName The name of the node type, usually found in the .type property of the node
 * @returns true if the node is a declaration of the given type, false otherwise
 */
const isOfNodeType = (node, declarationName) => {
    if (Array.isArray(declarationName)) {
        return declarationName.every((name) => isOfNodeType(node, name));
    }
    return node && node.type === declarationName;
};

/**
 * This function takes in a node and a declaration name, and returns the node casted to the given type.
 *
 * @param node A node in a recast AST
 * @param declarationName The name of the node type, usually found in the .type property of the node
 * @returns The node casted to the given type
 * @throws Error if the node is undefined, or if the node is not of the given type
 */
const getTypeSafeNode = (node, declarationName // TODO: if this can in anyway be inferred from T, that would be great
) => {
    if (!node) {
        throw new Error("Node is undefined");
    }
    if (node.type !== declarationName) {
        throw new Error(`Expected ${declarationName} but got ${node.type}`);
    }
    if (!isOfNodeType(node, declarationName)) {
        throw new Error(`Expected node to be of type ${declarationName}`);
    }
    return node;
};

/**
 * Generates a code string from a recast AST
 *
 * @param ast An AST that has been generated from a code string using recast
 * @param options Options for pretty printing the code
 * @returns A string representing the code in the AST
 */
const generateCodeFromAST = (ast, options) => recast.prettyPrint(ast, options).code;

/**
 * Generates an AST from a string of code
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 *
 * @param code A string of code to generate an AST from
 * @returns An AST of the code
 */
const generateAstFromCode = (code) => {
    return recast.parse(code, {
        parser: require("recast/parsers/babel-ts"),
    });
};

const createFunctionNameDefinition = (options) => ({
    name: options.name,
    isClass: options.isClass || false,
    isDefault: options.isDefault || false,
    isOptional: options.isOptional || false,
    parameters: options.parameters,
    node: options.node,
});

const getNameFromExportSpecifier = (exportedFunction) => {
    const functionNameDefinition = createFunctionNameDefinition({
        name: "",
        node: exportedFunction,
        parameters: [],
    });
    if (isOfNodeType(exportedFunction, "ExportDefaultSpecifier")) {
        return Object.assign(Object.assign({}, functionNameDefinition), { name: exportedFunction.exported.name, isDefault: true });
    }
    if (isOfNodeType(exportedFunction, "ExportSpecifier") ||
        isOfNodeType(exportedFunction, "ExportNamespaceSpecifier")) {
        if (isOfNodeType(exportedFunction.exported, "Identifier")) {
            return Object.assign(Object.assign({}, functionNameDefinition), { name: exportedFunction.exported.name });
        }
        return Object.assign(Object.assign({}, functionNameDefinition), { name: "default", isDefault: true });
    }
    return functionNameDefinition;
};

const typeStructures = [
    "Keyword",
    "Type",
    "Predicate",
    "Query",
];
const parseNodeType = (nodeDataType) => {
    for (const typeStructure of typeStructures) {
        if (nodeDataType.endsWith(typeStructure)) {
            const regex = new RegExp(`TS(.*?)${typeStructure}`, "g");
            return nodeDataType
                .replace(regex, " $1")
                .trim()
                .toLowerCase();
        }
    }
    // For everyting else, we just remove the TS prefix and lowercase the first letter
    // e.g. TSTypeLiteral -> typeLiteral
    const result = nodeDataType.replace(/TS(.*?)/g, " $1").trim();
    return result.replace(/^.{1}/g, result[0].toLowerCase());
};

const getParametersFromNode = (node) => {
    let params = [];
    if ("params" in node) {
        params = node.params;
    }
    else if ("init" in node && node.init && "params" in node.init) {
        if (node.init.params.length === 1) {
            if (isOfNodeType(node.init.params[0], "ObjectPattern")) {
                const objectPattern = node.init.params[0];
                if ("properties" in objectPattern && objectPattern.properties) {
                    params = objectPattern.properties
                        .filter((property) => "key" in property &&
                        isOfNodeType(property.key, "Identifier"))
                        .reduce((acc, property) => {
                        if ("key" in property && "name" in property.key) {
                            const identifier = {
                                name: property.key.name,
                                type: "Identifier",
                                optional: false,
                            };
                            return [...acc, identifier];
                        }
                        return acc;
                    }, []);
                }
            }
        }
        else {
            params = node.init.params;
        }
    }
    else if (isOfNodeType(node, "VariableDeclarator") &&
        node.init &&
        "params" in node.init) {
        params = node.init.params;
    }
    else if (isOfNodeType(node, "Expression")) ;
    else if (isOfNodeType(node, "ClassDeclaration")) {
        const outerBoddy = node.body;
        if (isOfNodeType(outerBoddy, "ClassBody")) {
            const innerBodies = outerBoddy.body;
            const classConstructor = innerBodies.find((body) => isOfNodeType(body, "ClassMethod") &&
                body.kind === "constructor");
            if (classConstructor) {
                if ("params" in classConstructor) {
                    params = classConstructor.params.filter((param) => "name" in param);
                }
            }
        }
    }
    return params
        .filter((params) => "name" in params)
        .map((param) => {
        const type = param.typeAnnotation && "typeAnnotation" in param.typeAnnotation
            ? param.typeAnnotation.typeAnnotation.type
            : "TSAnyKeyword";
        return {
            name: param.name,
            type: parseNodeType(type),
            tsType: type,
            isOptional: param.optional || false,
        };
    });
};

const getNameFromDefaultExportedDeclaration = (defaultExportedDeclaration) => {
    var _a, _b;
    if (isOfNodeType(defaultExportedDeclaration.declaration, "Expression")) {
        return createFunctionNameDefinition({
            name: "default",
            isDefault: true,
            node: defaultExportedDeclaration.declaration,
            parameters: getParametersFromNode(defaultExportedDeclaration.declaration),
        });
    }
    if (defaultExportedDeclaration && defaultExportedDeclaration.declaration) {
        let name = "default";
        if ("id" in defaultExportedDeclaration.declaration) {
            name = ((_a = defaultExportedDeclaration.declaration.id) === null || _a === void 0 ? void 0 : _a.name) || "";
        }
        return createFunctionNameDefinition({
            name,
            isClass: types.isClass(defaultExportedDeclaration.declaration),
            isDefault: true,
            node: defaultExportedDeclaration.declaration,
            parameters: getParametersFromNode(defaultExportedDeclaration.declaration),
        });
    }
    const name = ("name" in defaultExportedDeclaration.declaration
        ? defaultExportedDeclaration.declaration.name
        : (_b = defaultExportedDeclaration.declaration.id) === null || _b === void 0 ? void 0 : _b.name) || "";
    return createFunctionNameDefinition({
        name,
        isClass: types.isClass(defaultExportedDeclaration.declaration),
        isDefault: true,
        node: defaultExportedDeclaration.declaration,
        parameters: getParametersFromNode(defaultExportedDeclaration.declaration),
    });
};

const getFunctionOrClassNameFromExportStatements = (statement) => {
    var _a, _b, _c;
    const exportedFunctionNames = [];
    const exportedFunction = getTypeSafeNode(statement, statement.type);
    if (isOfNodeType(exportedFunction, "ExportDefaultDeclaration")) {
        exportedFunctionNames.push(getNameFromDefaultExportedDeclaration(exportedFunction));
    }
    if (isOfNodeType(exportedFunction, "ExportNamedDeclaration")) {
        const namedExportedFunction = exportedFunction;
        if (namedExportedFunction.specifiers &&
            namedExportedFunction.specifiers.length > 0) {
            namedExportedFunction.specifiers.forEach((specifier) => {
                if (!isOfNodeType(specifier, [
                    "ExportSpecifier",
                    "ExportDefaultSpecifier",
                    "ExportNamespaceSpecifier",
                ])) {
                    const exportedFunction = getNameFromExportSpecifier(specifier);
                    exportedFunctionNames.push(exportedFunction);
                }
            });
        }
        else if (namedExportedFunction.declaration) {
            if (!isOfNodeType(namedExportedFunction.declaration, "Expression")) {
                if (isOfNodeType(namedExportedFunction.declaration, "VariableDeclaration")) {
                    namedExportedFunction.declaration.declarations.forEach((declaration) => {
                        if (isOfNodeType(declaration.id, "Identifier")) {
                            exportedFunctionNames.push(createFunctionNameDefinition({
                                name: declaration.id.name,
                                isClass: types.isClass(declaration),
                                node: declaration,
                                parameters: getParametersFromNode(declaration),
                            }));
                        }
                        else if (isOfNodeType(declaration.id, "ObjectPattern")) {
                            declaration.id.properties.forEach((property) => {
                                if (isOfNodeType(property, "ObjectProperty")) {
                                    if (isOfNodeType(property.key, "Identifier")) {
                                        exportedFunctionNames.push(createFunctionNameDefinition({
                                            name: property.key.name,
                                            isClass: types.isClass(declaration),
                                            node: declaration,
                                            parameters: getParametersFromNode(declaration),
                                        }));
                                    }
                                }
                            });
                        }
                        else {
                            const name = declaration.id.toString();
                            if (name) {
                                exportedFunctionNames.push(createFunctionNameDefinition({
                                    name,
                                    isClass: types.isClass(declaration),
                                    node: declaration,
                                    parameters: getParametersFromNode(declaration),
                                }));
                            }
                        }
                    });
                }
                else if (isOfNodeType(namedExportedFunction.declaration, "ClassDeclaration")) {
                    const declarationName = (_a = namedExportedFunction.declaration.id) === null || _a === void 0 ? void 0 : _a.name;
                    const forcedIdentifierName = (_b = namedExportedFunction.declaration.id) === null || _b === void 0 ? void 0 : _b.toString();
                    const name = declarationName || forcedIdentifierName || "";
                    if (!name) {
                        throw new Error("Could not identify node name");
                    }
                    exportedFunctionNames.push(createFunctionNameDefinition({
                        name,
                        isClass: true,
                        node: namedExportedFunction.declaration,
                        parameters: getParametersFromNode(namedExportedFunction.declaration),
                    }));
                }
                else {
                    const declaration = namedExportedFunction.declaration;
                    if (isOfNodeType(declaration, "DeclareExportAllDeclaration")) ;
                    else {
                        if (declaration && "id" in declaration) {
                            if (isOfNodeType(declaration.id, "Identifier")) {
                                const name = declaration.id.name;
                                if (name) {
                                    exportedFunctionNames.push(createFunctionNameDefinition({
                                        name,
                                        isClass: types.isClass(declaration),
                                        node: declaration,
                                        parameters: getParametersFromNode(declaration),
                                    }));
                                }
                            }
                            else {
                                exportedFunctionNames.push(createFunctionNameDefinition({
                                    name: ((_c = declaration.id) === null || _c === void 0 ? void 0 : _c.toString()) || "",
                                    isClass: types.isClass(declaration),
                                    node: declaration,
                                    parameters: getParametersFromNode(declaration),
                                }));
                            }
                        }
                    }
                }
            }
        }
        else if (isOfNodeType(exportedFunction, "ExportAllDeclaration")) ;
        else {
            throw new Error("This should not be possible!");
        }
    }
    return exportedFunctionNames;
};

/**
 * This function takes in a string of code or an AST and returns the name of the function or class, and a boolean indicating if it is a class.
 *
 * @example
 * const code = `export const myFunction = (a: number, b: number): number => a + b;`;
 * const ast = generateAstFromCode(code);
 *
 * const results = parseFunctionOrClass(ast);
 *
 * const node = results[0];
 * const parameters = node.parameters;
 *
 * // [{"name":"a","type":"number","tsType":"TSNumberKeyword","isOptional":false},{"name":"b","type":"number","tsType":"TSNumberKeyword","isOptional":false}]
 *
 * @param code Either a string representation of the code to parse, or an AST of the code.
 * @returns A FunctionNameDefinition object with the name of the function or class, and a boolean indicating if it is a class.
 * @throws Error if the code does not correspond to a standard AST, or if the code does not contain a function or class.
 */
const parseFunctionOrClass = (code) => {
    const ast = typeof code === "string" ? generateAstFromCode(code) : code;
    const exportStatements = ast.program.body.filter((bodyPart) => bodyPart.type === "ExportNamedDeclaration" ||
        bodyPart.type === "ExportDefaultDeclaration");
    const hasTooFewExports = exportStatements.length < 1;
    if (hasTooFewExports) {
        return [];
    }
    const acceptableExportedTypes = [
        "ExportNamedDeclaration",
        "ExportDefaultDeclaration",
    ];
    if (!acceptableExportedTypes.includes(exportStatements[0].type)) {
        // TODO: is this me being anal retentive? Can this never happen?
        throw new Error("This extension only works with named or default exports. Please add a named or default export to the function or class.");
    }
    return exportStatements
        .map((statement) => getFunctionOrClassNameFromExportStatements(statement))
        .flat();
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const parseTextDocument = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    if (!doc) {
        throw new Error("currently open file uri could not be determined.");
    }
    if (doc.fileName.includes(".test.")) {
        const fileName = path.basename(doc.fileName);
        throw new Error(`The file "${fileName}" is already a test file.`);
    }
    const text = doc.getText();
    const fileName = doc.fileName;
    const fileExtension = fileName.split(".").pop();
    const currentlyOpenFileUri = doc.uri;
    return { text, currentlyOpenFileUri, fileExtension, fileName };
});

/**
 * Get the content and information about a file on disk, or the currently open file in the editor.
 * @param filePath The path to the file on disk, or undefined to get the currently open file in the editor.
 * @returns The text content of the file, the URI of the currently open file, and the file name and extension.
 */
const getFileInfo = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let text = "";
    let fileName = "";
    let fileExtension = "";
    let currentlyOpenFileUri = vscode__namespace.Uri.file("");
    if (filePath) {
        text = fs.readFileSync(filePath, "utf8");
        fileName = filePath.split("/").pop() || "";
        fileExtension = fileName.includes(".")
            ? filePath.split(".").pop() || ""
            : "";
        currentlyOpenFileUri = vscode__namespace.Uri.file(filePath);
    }
    else {
        const document = (_a = vscode__namespace.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        const documentInfo = yield parseTextDocument(document);
        text = documentInfo.text;
        fileName = documentInfo.fileName;
        fileExtension = documentInfo.fileExtension || "";
        currentlyOpenFileUri = documentInfo.currentlyOpenFileUri;
    }
    if (!fileExtension) {
        fileExtension = "js";
    }
    const dir = path.dirname(currentlyOpenFileUri.fsPath);
    return { text, currentlyOpenFileUri, fileExtension, fileName, dir };
});

exports.generateAstFromCode = generateAstFromCode;
exports.generateCodeFromAST = generateCodeFromAST;
exports.getFileInfo = getFileInfo;
exports.getTypeSafeNode = getTypeSafeNode;
exports.isOfNodeType = isOfNodeType;
exports.parseFunctionOrClass = parseFunctionOrClass;
//# sourceMappingURL=index.js.map
