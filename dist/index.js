var recast = require('recast');
var types = require('@babel/types');

/**
 * Checks if a recast AST Node is a declaration of a given type
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

exports.generateAstFromCode = generateAstFromCode;
exports.generateCodeFromAST = generateCodeFromAST;
exports.getTypeSafeNode = getTypeSafeNode;
exports.isOfNodeType = isOfNodeType;
exports.parseFunctionOrClass = parseFunctionOrClass;
//# sourceMappingURL=index.js.map
