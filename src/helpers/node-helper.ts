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
import { NodeAccessModifier } from "../enums/node-access-modifier";
import { Node } from "../Nodes/Node";

// #region Functions (18)

export function getAccessorDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.AutoAccessorPropertyDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.AutoAccessorPropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const name = identifier.escapedText.toString();
    const type = node.type ? node.type.getText(sourceFile) : "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = name.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? NodeAccessModifier.private : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? NodeAccessModifier.protected : NodeAccessModifier.public);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    return new AccessorDeclarationNode(name, type, accessModifier, isStatic, isAbstract, parent, command, start, end, configuration);
}

export function getClassDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ClassDeclaration, parent: Node | null, children: Node[], configuration: Configuration)
{
    const hasKeyword = (node: ts.ClassDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const name = identifier.escapedText.toString();
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new ClassDeclarationNode(name, isExport, isAbstract, parent, children, command, start, end, configuration);
}

export function getConstructorDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ConstructorDeclaration, parent: Node, configuration: Configuration)
{
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const parameters: Parameter[] = [];
    const properties: (PropertyDeclarationNode | ReadonlyPropertyDeclarationNode)[] = [];
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
        const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";
        const parameterPosition = sourceFile.getLineAndCharacterOfPosition(parameter.name.getStart(sourceFile, false));
        const parameterAccessModifier = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.PrivateKeyword) ? NodeAccessModifier.private :
            (parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.ProtectedKeyword) ? NodeAccessModifier.protected :
                (parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.PublicKeyword) ? NodeAccessModifier.public : null));
        const parameterIsReadOnly = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
        const parameterStart = editor!.document.positionAt(parameter.getStart(sourceFile, false));
        const parameterEnd = editor!.document.positionAt(parameter.getEnd());
        const parameterCommand = getGotoCommand(editor, parameterPosition);

        if (parameterAccessModifier)
        {
            if (configuration.showReadonlyPropertiesAsConst && parameterIsReadOnly)
            {
                properties.push(new ReadonlyPropertyDeclarationNode(parameterName, parameterType, parameterAccessModifier, false, false, parent, parameterCommand, parameterStart, parameterEnd, configuration));
            }
            else
            {
                properties.push(new PropertyDeclarationNode(parameterName, parameterType, parameterAccessModifier, false, false, parent, parameterCommand, parameterStart, parameterEnd, configuration));
            }
        }

        parameters.push(new Parameter(parameterName, parameterType));
    }

    const constructorNode = new ConstructorDeclarationNode(parameters, parent, command, start, end, configuration);

    return [constructorNode as DeclarationNode].concat(properties);
}

export function getEnumDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.EnumDeclaration, parent: Node | null, children: Node[], configuration: Configuration)
{
    const hasKeyword = (node: ts.EnumDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const enumName = identifier.escapedText.toString();
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new EnumDeclarationNode(enumName, isExport, parent, children, command, start, end, configuration);
}

export function getEnumMemberDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.EnumMember, parent: Node, configuration: Configuration)
{
    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const enumMemberName = identifier.escapedText.toString();
    const enumMemberValue = node.initializer?.getText(sourceFile) ?? null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    return new EnumMemberDeclarationNode(enumMemberName, enumMemberValue, parent, command, start, end, configuration);
}

export function getFunctionDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.FunctionDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.FunctionDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const functionName = identifier.escapedText.toString();
    const parameters: Parameter[] = [];
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const isAsync = hasKeyword(node, ts.SyntaxKind.AsyncKeyword);
    const returnType = node.type?.getText(sourceFile) ?? "void";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    // function parameters
    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
        const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

        parameters!.push(new Parameter(parameterName, parameterType));
    }

    return new FunctionDeclarationNode(functionName, isExport, isAsync, parameters, returnType, parent, command, start, end, configuration);
}

export function getGetterDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.GetAccessorDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.AccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const getterName = identifier.escapedText.toString();
    const getterType = node.type ? node.type.getText(sourceFile) : "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = getterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? NodeAccessModifier.private : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? NodeAccessModifier.protected : NodeAccessModifier.public);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    return new GetterDeclarationNode(getterName, getterType, accessModifier, isStatic, isAbstract, parent, command, start, end, configuration);
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

export function getIndexSignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.IndexSignatureDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.IndexSignatureDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const indexParameter = node.parameters.map(p => new Parameter(p.name.getText(sourceFile), p.type?.getText(sourceFile) ?? "any"));
    const indexReturnType = node.type.getText(sourceFile);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const command = getGotoCommand(editor, position);

    return new IndexSignatureDeclarationNode(indexParameter, indexReturnType, isStatic, isReadOnly, parent, command, start, end, configuration);
}

export function getInterfaceDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.InterfaceDeclaration, parent: Node | null, children: Node[], configuration: Configuration)
{
    const hasKeyword = (node: ts.InterfaceDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const interfaceName = identifier.escapedText.toString();
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const command = getGotoCommand(editor, position);

    return new InterfaceDeclarationNode(interfaceName, isExport, parent, children, command, start, end, configuration);
}

export function getMethodDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.MethodDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.MethodDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const methodName = identifier.escapedText.toString();
    const parameters: Parameter[] = [];
    const accessModifier = methodName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? NodeAccessModifier.private : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? NodeAccessModifier.protected : NodeAccessModifier.public);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAsync = hasKeyword(node, ts.SyntaxKind.AsyncKeyword);
    const returnType: string  = node.type?.getText(sourceFile) ?? "void";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    // method parameters
    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
        const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

        parameters!.push(new Parameter(parameterName, parameterType));
    }

    return new MethodDeclarationNode(methodName, parameters, returnType, accessModifier, isStatic, isAbstract, isAsync, parent, command, start, end, configuration);
}

export function getMethodSignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.MethodSignature, parent: Node, configuration: Configuration)
{
    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const methodName = identifier.escapedText.toString();
    const parameters: Parameter[] = [];
    const returnType: string  = node.type?.getText(sourceFile) ?? "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    // method parameters
    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
        const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

        parameters!.push(new Parameter(parameterName, parameterType));
    }

    return new MethodSignatureDeclarationNode(methodName, parameters, returnType, parent, command, start, end, configuration);
}

export function getPropertyDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.PropertyDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.PropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const propertyName = identifier.escapedText.toString();
    const propertyType = node.type ? node.type.getText(sourceFile) : "any";
    const accessModifier = propertyName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? NodeAccessModifier.private : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? NodeAccessModifier.protected : NodeAccessModifier.public);
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
            const arrowFunctionParameters: Parameter[]= [];
            const arrowFunctionReturnType: string  = arrowFunctionNode.type?.getText(sourceFile) ?? "void";
            const arrowFunctionIsAsync = node.initializer ? arrowFunctionHasModifier(node.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // arrow function parameters
            for (const parameter of arrowFunctionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                arrowFunctionParameters!.push(new Parameter(parameterName, parameterType));
            }

            return new MethodDeclarationNode(propertyName, arrowFunctionParameters, arrowFunctionReturnType, accessModifier, isStatic, false, arrowFunctionIsAsync, parent, command, start, end, configuration);
        }
        else if (isFunction)
        {
            const functionHasModifier = (node: ts.FunctionLikeDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
            const functionNode = <ts.FunctionLikeDeclaration>node.initializer;
            const functionParameters: Parameter[]= [];
            const functionReturnType: string  = functionNode.type?.getText(sourceFile) ?? "void";
            const functionIsAsync = node.initializer ? functionHasModifier(node.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // function parameters
            for (const parameter of functionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                functionParameters!.push(new Parameter(parameterName, parameterType));
            }

            return new MethodDeclarationNode(propertyName, functionParameters, functionReturnType, accessModifier, isStatic, false, functionIsAsync, parent, command, start, end, configuration);
        }
    }

    if (configuration.showReadonlyPropertiesAsConst && isReadOnly)
    {
        return new ReadonlyPropertyDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isAbstract, parent, command, start, end, configuration);
    }
    else
    {
        return new PropertyDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isAbstract, parent, command, start, end, configuration);
    }
}

export function getPropertySignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.PropertySignature, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.PropertySignature, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const propertyName = identifier.escapedText.toString();
    const propertyType = node.type ? node.type.getText(sourceFile) : "any";
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isArrowFunction = node.type?.kind === ts.SyntaxKind.FunctionType;
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
            const arrowFunctionReturnType: string  = arrowFunction.type?.getText(sourceFile) ?? null;

            // arrow function parameters
            for (const parameter of arrowFunction.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                arrowFunctionParameters!.push(new Parameter(parameterName, parameterType));
            }

            return new MethodSignatureDeclarationNode(propertyName, arrowFunctionParameters, arrowFunctionReturnType, parent, command, start, end, configuration);
        }
    }

    if (configuration.showReadonlyPropertiesAsConst && isReadOnly)
    {
        return new ReadonlyPropertySignatureDeclarationNode(propertyName, propertyType, parent, command, start, end, configuration);
    }
    else
    {
        return new PropertySignatureDeclarationNode(propertyName, propertyType, parent, command, start, end, configuration);
    }
}

export function getSetterDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.SetAccessorDeclaration, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.SetAccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const setterName = identifier.escapedText.toString();
    const setterType = node.type ? node.type.getText(sourceFile) : "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = setterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? NodeAccessModifier.private : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? NodeAccessModifier.protected : NodeAccessModifier.public);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const command = getGotoCommand(editor, position);

    return new SetterDeclarationNode(setterName, setterType, accessModifier, isStatic, isAbstract, parent, command, start, end, configuration);
}

export function getStaticBlockDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ClassStaticBlockDeclaration, parent: Node, configuration: Configuration)
{
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const command = getGotoCommand(editor, position);

    if (configuration.showStaticMemberIndicator)
    {
        return new StaticCodeBlockDeclarationNode(parent, command, start, end);
    } else
    {
        return new ConstructorDeclarationNode([], parent, command, start, end, configuration);
    }
}

export function getTypeAliasDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.TypeAliasDeclaration, parent: Node | null, children: Node[], configuration: Configuration)
{
    const hasKeyword = (node: ts.TypeAliasDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const typeAliasName = identifier.escapedText.toString();
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const command = getGotoCommand(editor, position);

    return new TypeAliasDeclarationNode(typeAliasName, isExport, parent, children, command, start, end, configuration);
}

export function getVariableDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.VariableStatement, parent: Node, configuration: Configuration)
{
    const hasKeyword = (node: ts.VariableStatement, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
    const declarationNodes = [];

    for (const variableDeclaration of node.declarationList.declarations)
    {
        const identifier = <ts.Identifier>variableDeclaration.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const variableName = identifier.escapedText.toString();
        const variableType = variableDeclaration.type ? variableDeclaration.type.getText(sourceFile) : "any";
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
            const arrowFunctionReturnType: string = arrowFunctionNode.type?.getText(sourceFile) ?? "void";
            const arrowFunctionIsAsync = variableDeclaration.initializer ? arrowFunctionHasModifier(variableDeclaration.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // arrow function parameters
            for (const parameter of arrowFunctionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                arrowFunctionParameters!.push(new Parameter(parameterName, parameterType));
            }

            declarationNodes.push(new FunctionDeclarationNode(variableName, isExport, arrowFunctionIsAsync, arrowFunctionParameters, arrowFunctionReturnType, parent, command, start, end, configuration));
        }
        else if (((configuration.showArrowFunctionVariablesAsMethods && !isConst) ||
            (configuration.showArrowFunctionConstVariablesAsMethods && isConst)) &&
            isFunction)
        {
            const functionHasModifier = (node: ts.FunctionLikeDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
            const functionNode = <ts.FunctionLikeDeclaration>variableDeclaration.initializer;
            const functionParameters: Parameter[] = [];
            const functionReturnType: string = functionNode.type?.getText(sourceFile) ?? "void";
            const functionIsAsync = variableDeclaration.initializer ? functionHasModifier(variableDeclaration.initializer as ts.ArrowFunction, ts.SyntaxKind.AsyncKeyword) : false;

            // function parameters
            for (const parameter of functionNode.parameters)
            {
                const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";

                functionParameters!.push(new Parameter(parameterName, parameterType));
            }

            declarationNodes.push(new FunctionDeclarationNode(variableName, isExport, functionIsAsync, functionParameters, functionReturnType, parent, command, start, end, configuration));
        }
        else if (configuration.showConstVariablesAsConst && isConst)
        {
            declarationNodes.push(new ConstVariableDeclarationNode(variableName, variableType, isExport, parent, command, start, end, configuration));
        }
        else
        {
            declarationNodes.push(new VariableDeclarationNode(variableName, variableType, isExport, parent, command, start, end, configuration));
        }
    }

    return declarationNodes;
}

// #endregion Functions (18)
