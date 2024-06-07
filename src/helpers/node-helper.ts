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
import { ConstDeclarationNode } from "../Nodes/ConstDeclarationNode";

// #region Functions (18)

export function getAccessorDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.AutoAccessorPropertyDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.AutoAccessorPropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const accessorName = identifier.escapedText.toString();
    const accessorType = node.type ? node.type.getText(sourceFile) : "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = accessorName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);

    return new AccessorDeclarationNode(accessorName, accessorType, accessModifier, isStatic, isAbstract, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getClassDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ClassDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.ClassDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const className = identifier.escapedText.toString();
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    return new ClassDeclarationNode(className, isExport, isAbstract, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getConstructorDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ConstructorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const parameters: Parameter[] = [];
    const properties: (PropertyDeclarationNode | ConstDeclarationNode)[] = [];
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
        const parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";
        const parameterPosition = sourceFile.getLineAndCharacterOfPosition(parameter.name.getStart(sourceFile, false));
        const parameterAccessModifier = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.PublicKeyword || x.kind == ts.SyntaxKind.ProtectedKeyword || x.kind == ts.SyntaxKind.PrivateKeyword) as ts.Modifier;
        const parameterIsReadOnly = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
        const parameterStart = editor!.document.positionAt(parameter.getStart(sourceFile, false));
        const parameterEnd = editor!.document.positionAt(parameter.getEnd());

        if (parameterAccessModifier)
        {
            if (parameterIsReadOnly)
            {
                properties.push(new ConstDeclarationNode(parameterName, parameterType, parameterAccessModifier.getText(sourceFile), false, false, parentElement, [], getGotoCommand(editor, parameterPosition), parameterStart, parameterEnd));
            }
            else
            {
                properties.push(new PropertyDeclarationNode(parameterName, parameterType, parameterAccessModifier.getText(sourceFile), false, false, parentElement, [], getGotoCommand(editor, parameterPosition), parameterStart, parameterEnd));
            }
        }

        parameters.push(new Parameter(parameterName, parameterType));
    }

    const constructorNode = new ConstructorDeclarationNode(parameters, parentElement, childElements, getGotoCommand(editor, position), start, end);

    return [constructorNode].concat(properties);
}

export function getEnumDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.EnumDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.EnumDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const enumName = identifier.escapedText.toString();
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    return new EnumDeclarationNode(enumName, isExport, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getEnumMemberDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.EnumMember, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const enumMemberName = identifier.escapedText.toString();
    const enumMemberValue = node.initializer?.getText(sourceFile) ?? null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    return new EnumMemberDeclarationNode(enumMemberName, enumMemberValue, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getFunctionDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.FunctionDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.FunctionDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const functionName = identifier.escapedText.toString();
    const parameters: Parameter[] = [];
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
    const returnType = node.type?.getText(sourceFile) ?? null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    // function parameters
    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();

        if (parameter.type)
        {
            parameters.push(new Parameter(parameterName, parameter.type.getText(sourceFile)));
        }
        else
        {
            parameters.push(new Parameter(parameterName, "any"));
        }
    }

    return new FunctionDeclarationNode(functionName, isExport, parameters, returnType, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getGetterDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.GetAccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.AccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const getterName = identifier.escapedText.toString();
    const getterType = node.type ? node.type.getText(sourceFile) : "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = getterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);

    return new GetterDeclarationNode(getterName, getterType, accessModifier, isStatic, isAbstract, parentElement, childElements, getGotoCommand(editor, position), start, end);
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

export function getIndexSignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.IndexSignatureDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.IndexSignatureDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const indexParameter = node.parameters.map(p => new Parameter(p.name.getText(sourceFile), p.type?.getText(sourceFile) ?? ""));
    const indexReturnType = node.type.getText(sourceFile);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);

    return new IndexSignatureDeclarationNode(indexParameter, indexReturnType, isStatic, isReadOnly, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getInterfaceDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.InterfaceDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.InterfaceDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const interfaceName = identifier.escapedText.toString();
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);

    return new InterfaceDeclarationNode(interfaceName, isExport, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getMethodDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.MethodDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.MethodDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const methodName = identifier.escapedText.toString();
    const parameters: Parameter[] = [];
    const accessModifier = methodName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAsync = hasKeyword(node, ts.SyntaxKind.AsyncKeyword);
    const returnType: string | null = node.type?.getText(sourceFile) ?? null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    // method parameters
    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();

        if (parameter.type)
        {
            parameters.push(new Parameter(parameterName, parameter.type.getText(sourceFile)));
        }
        else
        {
            parameters.push(new Parameter(parameterName, "any"));
        }
    }

    return new MethodDeclarationNode(methodName, accessModifier, isStatic, isAbstract, isAsync, parameters, returnType, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getMethodSignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.MethodSignature, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const methodName = identifier.escapedText.toString();
    const parameters: Parameter[] = [];
    const returnType: string | null = node.type?.getText(sourceFile) ?? null;
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    // method parameters
    for (const parameter of node.parameters)
    {
        const parameterName = (<ts.Identifier>parameter.name).escapedText.toString();

        if (parameter.type)
        {
            parameters.push(new Parameter(parameterName, parameter.type.getText(sourceFile)));
        }
        else
        {
            parameters.push(new Parameter(parameterName, "any"));
        }
    }

    return new MethodSignatureDeclarationNode(methodName, parameters, returnType, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getPropertyDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.PropertyDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.PropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const propertyName = identifier.escapedText.toString();
    const propertyType = node.type ? node.type.getText(sourceFile) : "any";
    const accessModifier = propertyName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
    // const isArrowFunction = typeof node.initializer !== "undefined" && node.initializer.kind === ts.SyntaxKind.ArrowFunction;

    if (isReadOnly)
    {
        return new ConstDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isAbstract, parentElement, childElements, getGotoCommand(editor, position), start, end);
    }
    else
    {
        return new PropertyDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isAbstract, parentElement, childElements, getGotoCommand(editor, position), start, end);
    }
}

export function getPropertySignatureDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.PropertySignature, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.PropertySignature, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const propertyName = identifier.escapedText.toString();
    const propertyType = node.type ? node.type.getText(sourceFile) : "any";
    const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    return new PropertySignatureDeclarationNode(propertyName, propertyType, isReadOnly, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getSetterDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.SetAccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.SetAccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const setterName = identifier.escapedText.toString();
    const setterType = node.type ? node.type.getText(sourceFile) : "any";
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const accessModifier = setterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
    const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
    const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);

    return new SetterDeclarationNode(setterName, setterType, accessModifier, isStatic, isAbstract, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getStaticBlockDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.ClassStaticBlockDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());

    return new StaticCodeBlockDeclarationNode(parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getTypeAliasDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.TypeAliasDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.TypeAliasDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

    const identifier = <ts.Identifier>node.name;
    const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
    const typeAliasName = identifier.escapedText.toString();
    const start = editor!.document.positionAt(node.getStart(sourceFile, false));
    const end = editor!.document.positionAt(node.getEnd());
    const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);

    return new TypeAliasDeclarationNode(typeAliasName, isExport, parentElement, childElements, getGotoCommand(editor, position), start, end);
}

export function getVariableDeclarationNode(editor: vscode.TextEditor, sourceFile: ts.SourceFile, node: ts.VariableStatement, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
{
    const hasKeyword = (node: ts.VariableStatement, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);
    const variableDeclarationNodes = [];

    for (const variableDeclaration of node.declarationList.declarations)
    {
        const identifier = <ts.Identifier>variableDeclaration.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const variableName = identifier.escapedText.toString();
        const variableType = variableDeclaration.type ? variableDeclaration.type.getText(sourceFile) : "any";
        const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
        const isConst = hasKeyword(node, ts.SyntaxKind.ConstKeyword);
        const start = editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = editor!.document.positionAt(node.getEnd());

        variableDeclarationNodes.push(new VariableDeclarationNode(variableName, variableType, isExport, isConst, parentElement, childElements, getGotoCommand(editor, position), start, end));
    }

    return variableDeclarationNodes;
}

// #endregion Functions (18)
