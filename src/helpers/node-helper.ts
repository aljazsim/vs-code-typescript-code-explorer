import ts from "typescript";
import * as vscode from "vscode";
import { AccessorDeclarationNode } from "../Nodes/AccessorDeclarationNode";
import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { ConstructorDeclarationNode } from "../Nodes/ConstructorDeclarationNode";
import { Parameter } from "../Nodes/Parameter";
import { PropertyDeclarationNode } from "../Nodes/PropertyDeclarationNode";
import { PropertySignatureDeclarationNode } from "../Nodes/PropertySignatureDeclarationNode";
import { SetterDeclarationNode } from "../Nodes/SetterDeclarationNode";
import { StaticCodeBlockDeclarationNode } from "../Nodes/StaticCodeBlockDeclarationNode";
import { EnumDeclarationNode } from "../Nodes/EnumDeclarationNode";
import { EnumMemberDeclarationNode } from "../Nodes/EnumMemberDeclarationNode";
import { FunctionDeclarationNode } from "../Nodes/FunctionDeclarationNode";
import { IndexSignatureDeclarationNode } from "../Nodes/IndexSignatureDeclarationNode";
import { InterfaceDeclarationNode } from "../Nodes/InterfaceDeclarationNode";
import { MethodDeclarationNode } from "../Nodes/MethodDeclarationNode";
import { TypeAliasDeclarationNode } from "../Nodes/TypeAliasDeclarationNode";
import { VariableDeclarationNode } from "../Nodes/VariableDeclarationNode";
import { MethodSignatureDeclarationNode } from "../Nodes/MethodSignatureDeclarationNode";
import { GetterDeclarationNode } from "../Nodes/GetterDeclarationNode";
import { DeclarationNode } from "../Nodes/DeclarationNode";
import { ReadonlyPropertyDeclarationNode } from "../Nodes/ReadonlyPropertyDeclarationNode";
import { Configuration } from "../configuration/configuration";
import { ConstVariableDeclarationNode } from "../Nodes/ConstVariableDeclarationNode";
import { ReadonlyPropertySignatureDeclarationNode } from "../Nodes/ReadonlyPropertySignatureDeclarationNode";

// #region Functions (18)

export function getAccessorDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.AutoAccessorPropertyDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.AutoAccessorPropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const accessorName = identifier.escapedText.toString();
    const accessorType = configuration.showMemberTypes ? (node.type ? node.type.getText(sourceFile) : "any") : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = accessorName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    return new AccessorDeclarationNode(accessorName, accessorType, accessModifier, isStatic, isAbstract, parentNode, command, start, end);
}

export function getClassDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ClassDeclaration, parentNode: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.ClassDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const className = identifier.escapedText.toString();
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new ClassDeclarationNode(className, isExport, isAbstract, parentNode, childElements, command, start, end);
}

export function getConstructorDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ConstructorDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const parameters: Parameter[] | null = configuration.showMemberTypes ? [] : null;
    const properties: (PropertyDeclarationNode | ReadonlyPropertyDeclarationNode)[] = [];
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    if (configuration.showMemberTypes)
    {
        for (const parameter of node.parameters)
        {
            const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
            const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";
            const parameterPosition = sourceFile.getLineAndCharacterOfPosition(parameter.name.getStart(sourceFile, false));
            const parameterAccessModifier = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.PublicKeyword || x.kind == ts.SyntaxKind.ProtectedKeyword || x.kind == ts.SyntaxKind.PrivateKeyword) as ts.Modifier;
            const parameterIsReadOnly = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
            const parameterStart = editor!.document.positionAt(parameter.getStart(sourceFile, false));
            const parameterEnd = editor!.document.positionAt(parameter.getEnd());
            const parameterCommand = getGotoCommand(editor, parameterPosition);

            if (parameterAccessModifier)
            {
                if (configuration.showReadonlyPropertiesAsConst && parameterIsReadOnly)
                {
                    properties.push(new ReadonlyPropertyDeclarationNode(parameterName, parameterType, parameterAccessModifier.getText(sourceFile), false, false, parentNode, parameterCommand, parameterStart, parameterEnd));
                }
                else
                {
                    properties.push(new PropertyDeclarationNode(parameterName, parameterType, parameterAccessModifier.getText(sourceFile), false, false, parentNode, parameterCommand, parameterStart, parameterEnd));
                }
            }

            parameters!.push(new Parameter(parameterName, parameterType));
        }
    }

    const constructorNode = new ConstructorDeclarationNode(parameters, parentNode, command, start, end);

    return [constructorNode as DeclarationNode].concat(properties);
}

export function getEnumDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.EnumDeclaration, parentNode: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.EnumDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const enumName = identifier.escapedText.toString();
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new EnumDeclarationNode(enumName, isExport, parentNode, childElements, command, start, end);
}

export function getEnumMemberDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.EnumMember, parentNode: DeclarationNode, configuration: Configuration)
{
    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const enumMemberName = identifier.escapedText.toString();
    const enumMemberValue = configuration.showMemberTypes ? node.initializer?.getText(sourceFile) ?? null : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new EnumMemberDeclarationNode(enumMemberName, enumMemberValue, parentNode, command, start, end);
}

export function getFunctionDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.FunctionDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.FunctionDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const functionName = identifier.escapedText.toString();
    const parameters: Parameter[] | null = configuration.showMemberTypes ? [] : null;
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const isAsync = hasKeyword(node, ts.SyntaxKind.AsyncKeyword);
    const returnType = configuration.showMemberTypes ? (node.type?.getText(sourceFile) ?? null) : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    if (configuration.showMemberTypes)
    {
        // function parameters
        for (const parameter of node.parameters)
        {
            const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
            const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

            parameters!.push(new Parameter(parameterName, parameterType));
        }
    }

    return new FunctionDeclarationNode(functionName, isExport, isAsync, parameters, returnType, parentNode, command, start, end);
}

export function getGetterDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.GetAccessorDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.AccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const getterName = identifier.escapedText.toString();
    const getterType = configuration.showMemberTypes ? (node.type ? node.type.getText(sourceFile) : "any") : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = getterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    return new GetterDeclarationNode(getterName, getterType, accessModifier, isStatic, isAbstract, parentNode, command, start, end);
}

function getGotoCommand(editor: vscode.TextEditor, position: ts.LineAndCharacter)
{
    const commandName = "tsce.goto";
    const command = {
        command: commandName,
        title: '',
        arguments: [editor, new vscode.Position(position.line, position.character)]
    };

    return command;
}

export function getIndexSignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.IndexSignatureDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.IndexSignatureDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const indexParameter = configuration.showMemberTypes ? (node.parameters.map(p => new Parameter(p.name.getText(sourceFile), p.type?.getText(sourceFile) ?? "any"))) : null;
    const indexReturnType = configuration.showMemberTypes ? node.type.getText(sourceFile) : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const command = getGotoCommand(editor, position);

    return new IndexSignatureDeclarationNode(indexParameter, indexReturnType, isStatic, isReadOnly, parentNode, command, start, end);
}

export function getInterfaceDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.InterfaceDeclaration, parentNode: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.InterfaceDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const interfaceName = identifier.escapedText.toString();
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const command = getGotoCommand(editor, position);

    return new InterfaceDeclarationNode(interfaceName, isExport, parentNode, childElements, command, start, end);
}

export function getMethodDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.MethodDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.MethodDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const methodName = identifier.escapedText.toString();
    const parameters: Parameter[] | null = configuration.showMemberTypes ? [] : null;
    const accessModifier = methodName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAsync = hasKeyword(node, ts.SyntaxKind.AsyncKeyword);
    const returnType: string | null = node.type?.getText(sourceFile) ?? null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    if (configuration.showMemberTypes)
    {
        // method parameters
        for (const parameter of node.parameters)
        {
            const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
            const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

            parameters!.push(new Parameter(parameterName, parameterType));
        }
    }

    return new MethodDeclarationNode(methodName, accessModifier, isStatic, isAbstract, isAsync, parameters, returnType, parentNode, command, start, end);
}

export function getMethodSignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.MethodSignature, parentNode: DeclarationNode, configuration: Configuration)
{
    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const methodName = identifier.escapedText.toString();
    const parameters: Parameter[] | null = configuration.showMemberTypes ? [] : null;
    const returnType: string | null = configuration.showMemberTypes ? node.type?.getText(sourceFile) ?? null : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    if (configuration.showMemberTypes)
    {
        // method parameters
        for (const parameter of node.parameters)
        {
            const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
            const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

            parameters!.push(new Parameter(parameterName, parameterType));
        }
    }

    return new MethodSignatureDeclarationNode(methodName, parameters, returnType, parentNode, command, start, end);
}

export function getPropertyDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.PropertyDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.PropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const propertyName = identifier.escapedText.toString();
    const propertyType = configuration.showMemberTypes ? (node.type ? node.type.getText(sourceFile) : "any") : null;
    const accessModifier = propertyName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isArrowFunction = node.type?.kind === ts.SyntaxKind.FunctionType;
    const isFunction = !node.type && (node.initializer?.kind === ts.SyntaxKind.FunctionExpression || node.initializer?.kind === ts.SyntaxKind.ArrowFunction);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    if ((configuration.showArrowFunctionPropertiesAsMethods) ||
        (configuration.showReadonlyArrowFunctionPropertiesAsMethods && isReadOnly))
    {
        if (isArrowFunction)
        {
            const arrowFunctionHasModifier = (node: ts.ArrowFunction, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
            const arrowFunctionNode = <ts.FunctionTypeNode>node.type;
            const arrowFunctionParameters: Parameter[] = [];
            const arrowFunctionReturnType: string | null = arrowFunctionNode.type?.getText(sourceFile) ?? null;
            const arrowFunctionIsAsync = node.initializer ? arrowFunctionHasModifier(node.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // arrow function parameters
            for (const parameter of arrowFunctionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                arrowFunctionParameters.push(new Parameter(parameterName, parameterType));
            }

            return new MethodDeclarationNode(propertyName, accessModifier, isStatic, false, arrowFunctionIsAsync, arrowFunctionParameters, arrowFunctionReturnType, parentNode, command, start, end);
        }
        else if (isFunction)
        {
            const functionHasModifier = (node: ts.FunctionLikeDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
            const functionNode = <ts.FunctionLikeDeclaration>node.initializer;
            const functionParameters: Parameter[] = [];
            const functionReturnType: string | null = functionNode.type?.getText(sourceFile) ?? null;
            const functionIsAsync = node.initializer ? functionHasModifier(node.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // function parameters
            for (const parameter of functionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                functionParameters.push(new Parameter(parameterName, parameterType));
            }

            return new MethodDeclarationNode(propertyName, accessModifier, isStatic, false, functionIsAsync, functionParameters, functionReturnType, parentNode, command, start, end);
        }
    }

    if (configuration.showReadonlyPropertiesAsConst && isReadOnly)
    {
        return new ReadonlyPropertyDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isAbstract, parentNode, command, start, end);
    }
    else
    {
        return new PropertyDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isAbstract, parentNode, command, start, end);
    }
}

export function getPropertySignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.PropertySignature, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.PropertySignature, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const propertyName = identifier.escapedText.toString();
    const propertyType = configuration.showMemberTypes ? (node.type ? node.type.getText(sourceFile) : "any") : null;
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isArrowFunction = node.type?.kind === ts.SyntaxKind.FunctionType; // TODO\
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    if (isArrowFunction)
    {
        if ((configuration.showArrowFunctionPropertiesAsMethods) ||
            (configuration.showReadonlyArrowFunctionPropertiesAsMethods && isReadOnly))
        {
            const arrowFunction = <ts.FunctionTypeNode>node.type;
            const arrowFunctionParameters: Parameter[] = [];
            const arrowFunctionReturnType: string | null = arrowFunction.type?.getText(sourceFile) ?? null;

            // arrow function parameters
            for (const parameter of arrowFunction.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                arrowFunctionParameters.push(new Parameter(parameterName, parameterType));
            }

            return new MethodSignatureDeclarationNode(propertyName, arrowFunctionParameters, arrowFunctionReturnType, parentNode, command, start, end);
        }
    }

    if (configuration.showReadonlyPropertiesAsConst && isReadOnly)
    {
        return new ReadonlyPropertySignatureDeclarationNode(propertyName, propertyType, parentNode, command, start, end);
    }
    else
    {
        return new PropertySignatureDeclarationNode(propertyName, propertyType, parentNode, command, start, end);
    }
}

export function getSetterDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.SetAccessorDeclaration, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.SetAccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const setterName = identifier.escapedText.toString();
    const setterType = configuration.showMemberTypes ? (node.type ? node.type.getText(sourceFile) : "any") : null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = setterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    return new SetterDeclarationNode(setterName, setterType, accessModifier, isStatic, isAbstract, parentNode, command, start, end);
}

export function getStaticBlockDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ClassStaticBlockDeclaration, parentNode: DeclarationNode)
{
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new StaticCodeBlockDeclarationNode(parentNode, command, start, end);
}

export function getTypeAliasDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.TypeAliasDeclaration, parentNode: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.TypeAliasDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const typeAliasName = identifier.escapedText.toString();
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const command = getGotoCommand(editor, position);

    return new TypeAliasDeclarationNode(typeAliasName, isExport, parentNode, childElements, command, start, end);
}

export function getVariableDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.VariableStatement, parentNode: DeclarationNode, configuration: Configuration)
{
    const hasKeyword = (node: ts.VariableStatement, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
    const declarationNodes = [];

    for (const variableDeclaration of node.declarationList.declarations)
    {
        const identifier = <ts.Identifier>variableDeclaration.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const variableName = identifier.escapedText.toString();
        const variableType = configuration.showMemberTypes ? (variableDeclaration.type ? variableDeclaration.type.getText(sourceFile) : "any") : null;
        const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
        const isConst = hasKeyword(node, ts.SyntaxKind.ConstKeyword) || node.declarationList.flags === ts.NodeFlags.Const || variableDeclaration.flags === ts.NodeFlags.Const;
        const isArrowFunction = variableDeclaration.type?.kind === ts.SyntaxKind.FunctionType;
        const isFunction = !variableDeclaration.type && (variableDeclaration.initializer?.kind === ts.SyntaxKind.FunctionExpression || variableDeclaration.initializer?.kind === ts.SyntaxKind.ArrowFunction);
        const start = editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = editor!.document.positionAt(node.getEnd());
        const command = getGotoCommand(editor, position);

        if (((configuration.showArrowFunctionVariablesAsMethods && !isConst) ||
            (configuration.showArrowFunctionConstVariablesAsMethods && isConst)) &&
            isArrowFunction)
        {
            const arrowFunctionHasModifier = (node: ts.ArrowFunction, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
            const arrowFunctionNode = <ts.FunctionTypeNode>variableDeclaration.type;
            const arrowFunctionParameters: Parameter[] = [];
            const arrowFunctionReturnType: string | null = arrowFunctionNode.type?.getText(sourceFile) ?? null;
            const arrowFunctionIsAsync = variableDeclaration.initializer ? arrowFunctionHasModifier(variableDeclaration.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // arrow function parameters
            for (const parameter of arrowFunctionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                arrowFunctionParameters.push(new Parameter(parameterName, parameterType));
            }

            declarationNodes.push(new FunctionDeclarationNode(variableName, isExport, arrowFunctionIsAsync, arrowFunctionParameters, arrowFunctionReturnType, parentNode, command, start, end));
        }
        else if (((configuration.showArrowFunctionVariablesAsMethods && !isConst) ||
            (configuration.showArrowFunctionConstVariablesAsMethods && isConst)) &&
            isFunction)
        {
            const functionHasModifier = (node: ts.FunctionLikeDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
            const functionNode = <ts.FunctionLikeDeclaration>variableDeclaration.initializer;
            const functionParameters: Parameter[] = [];
            const functionReturnType: string | null = functionNode.type?.getText(sourceFile) ?? null;
            const functionIsAsync = variableDeclaration.initializer ? functionHasModifier(variableDeclaration.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // function parameters
            for (const parameter of functionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                functionParameters.push(new Parameter(parameterName, parameterType));
            }

            declarationNodes.push(new FunctionDeclarationNode(variableName, isExport, functionIsAsync, functionParameters, functionReturnType, parentNode, command, start, end));
        }
        else if (configuration.showConstVariablesAsConst && isConst)
        {
            declarationNodes.push(new ConstVariableDeclarationNode(variableName, variableType, isExport, isConst, parentNode, command, start, end));
        }
        else
        {
            declarationNodes.push(new VariableDeclarationNode(variableName, variableType, isExport, isConst, parentNode, command, start, end));
        }
    }

    return declarationNodes;
}

// #endregion Functions (18)
