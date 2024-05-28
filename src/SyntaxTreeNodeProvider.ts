import * as ts from "typescript";
import * as vscode from "vscode";
import { ClassDeclarationNode } from "./Nodes/ClassDeclarationNode";
import { ConstructorDeclarationNode } from "./Nodes/ConstructorDeclarationNode";
import { DeclarationNode } from "./Nodes/DeclarationNode";
import { EmptyDeclarationNode } from "./Nodes/EmptyDeclarationNode";
import { EnumDeclarationNode } from "./Nodes/EnumDeclarationNode";
import { EnumMemberDeclarationNode } from "./Nodes/EnumMemberDeclarationNode";
import { FunctionDeclarationNode } from "./Nodes/FunctionDeclarationNode";
import { GetterDeclarationNode } from "./Nodes/GetterDeclarationNode";
import { IndexSignatureDeclarationNode } from "./Nodes/IndexSignatureDeclarationNode";
import { InterfaceDeclarationNode } from "./Nodes/InterfaceDeclarationNode";
import { MethodDeclarationNode } from "./Nodes/MethodDeclarationNode";
import { MethodSignatureDeclarationNode } from "./Nodes/MethodSignatureDeclarationNode";
import { Parameter } from "./Nodes/Parameter";
import { PropertyDeclarationNode } from "./Nodes/PropertyDeclarationNode";
import { PropertySignatureDeclarationNode } from "./Nodes/PropertySignatureDeclarationNode";
import { ProviderResult } from "vscode";
import { SetterDeclarationNode } from "./Nodes/SetterDeclarationNode";
import { TypeAliasDeclarationNode } from "./Nodes/getTypeAliasDeclarationNode";
import { AccessorDeclarationNode } from "./Nodes/AccessorDeclarationNode";
import { StaticCodeBlockDeclarationNode } from "./Nodes/StaticCodeBlockDeclarationNode";
import { VariableDeclarationNode } from "./Nodes/VariableDeclarationNode";

export class SyntaxTreeNodeProvider implements vscode.TreeDataProvider<DeclarationNode>
{
    // #region Properties (4)

    private _onDidChangeTreeData: vscode.EventEmitter<DeclarationNode | undefined> = new vscode.EventEmitter<DeclarationNode | undefined>();
    private editor: vscode.TextEditor | null = null;
    private rootElements: DeclarationNode[] = [new EmptyDeclarationNode()];

    public readonly onDidChangeTreeData: vscode.Event<DeclarationNode | undefined> = this._onDidChangeTreeData.event;

    // #endregion Properties (4)

    // #region Constructors (1)

    constructor(private workspaceRoot: string)
    {
    }

    // #endregion Constructors (1)

    // #region Public Getters And Setters (1)

    public get rootElement(): DeclarationNode
    {
        return this.rootElements[0];
    }

    // #endregion Public Getters And Setters (1)

    // #region Public Methods (6)

    public findNode(nodes: DeclarationNode[], positionStart: vscode.Position, positionEnd: vscode.Position): DeclarationNode | null
    {
        let result: DeclarationNode | null;

        // try to find a match among the child nodes
        for (let node of nodes)
        {
            result = this.findNode(node.children, positionStart, positionEnd);

            if (result)
            {
                return result;
            }
        }

        // try to find a match among the nodes
        for (let node of nodes)
        {
            if (node.start.isBeforeOrEqual(positionStart) &&
                node.end.isAfterOrEqual(positionEnd))
            {
                return node;
            }
        }

        return null;
    }

    public getChildren(element?: DeclarationNode): Thenable<DeclarationNode[]>
    {
        let children: DeclarationNode[] = [];

        if (this.workspaceRoot &&
            this.editor)
        {
            children = element ? element.children : this.rootElements;
        }

        return Promise.resolve(children);
    }

    public getNode(positionStart: vscode.Position, positionEnd: vscode.Position)
    {
        return this.findNode(this.rootElements, positionStart, positionEnd);
    }

    public getParent?(element: DeclarationNode): ProviderResult<DeclarationNode>
    {
        if (element)
        {
            return element.parent;
        }
        else
        {
            return null;
        }
    }

    public getTreeItem(element: DeclarationNode): vscode.TreeItem
    {
        return element;
    }

    public refresh(editor: vscode.TextEditor): void
    {
        this.editor = editor;

        if (this.editor)
        {
            this.rootElements = this.analyzeSyntaxTree(this.editor!.document.getText());
        }
        else
        {
            this.rootElements = [new EmptyDeclarationNode()];
        }

        this._onDidChangeTreeData.fire(undefined);
    }

    // #endregion Public Methods (6)

    // #region Private Methods (22)

    private analyzeSyntaxTree(sourceCode: string)
    {
        const rootElements: DeclarationNode[] = [];
        const sourceFile = ts.createSourceFile("temp", sourceCode, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        // todo
        // const program = ts.createProgram(["temp"], { target: ts.ScriptTarget.Latest, sorce });

        // analyze ast
        for (let node of sourceFile.getChildren(sourceFile))
        {
            for (let rootElement of this.visitSyntaxTree(node, sourceFile, null))
            {
                rootElements.push(rootElement);
            }
        }

        if (rootElements.length == 0)
        {
            // default item
            rootElements.push(new EmptyDeclarationNode());
        }

        return rootElements.sort((a, b) => this.compare(a, b));
    }

    private compare(a: DeclarationNode, b: DeclarationNode)
    {
        let valueA = this.getOrder(a);
        let valueB = this.getOrder(b);

        if (valueA > valueB)
        {
            return 1;
        }
        else if (valueA < valueB)
        {
            return -1;
        }
        else
        {
            if (a.label!.toString().toLowerCase() > b.label!.toString().toLowerCase())
            {
                return 1;
            }
            else if (a.label!.toString().toLowerCase() < b.label!.toString().toLowerCase())
            {
                return -1;
            }
            else
            {
                return 0;
            }
        }
    }

    private getAccessorDeclarationNode(sourceFile: ts.SourceFile, node: ts.AccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.AccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const accessorName = identifier.escapedText.toString();
        const accessorType = node.type ? node.type.getText(sourceFile) : "any";
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());
        const accessModifier = accessorName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
        const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);


        return new AccessorDeclarationNode(accessorName, accessorType, accessModifier, isStatic, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getClassDeclarationNode(sourceFile: ts.SourceFile, node: ts.ClassDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.ClassDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const className = identifier.escapedText.toString();
        const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
        const isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

        return new ClassDeclarationNode(className, isExport, isAbstract, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getCommand(position: ts.LineAndCharacter)
    {
        const commandName = "tsce.goto";
        const position2 = new vscode.Position(position.line, position.character);
        const command = {
            command: commandName,
            title: '',
            arguments: [this.editor, position2]
        };

        return command;
    }

    private getConstructorDeclarationNode(sourceFile: ts.SourceFile, node: ts.ConstructorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        let position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
        let parameterName: string;
        let parameterType: string;
        let parameters: Parameter[] = [];
        let parameterPosition: ts.LineAndCharacter;
        let parameterAccessModifier: ts.Modifier | undefined = undefined;
        let parameterIsStatic: boolean;
        let parameterIsConst: boolean;
        let parameterStart: vscode.Position;
        let parameterEnd: vscode.Position;
        let parameterIsReadOnly: boolean;
        let constructorNode: ConstructorDeclarationNode;
        let properties: PropertyDeclarationNode[] = [];
        let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        let end = this.editor!.document.positionAt(node.getEnd());

        for (const parameter of node.parameters)
        {
            if (parameter.modifiers &&
                parameter.modifiers.length > 0)
            {
                parameterName = (<ts.Identifier>parameter.name).escapedText.toString();
                parameterType = parameter.type ? parameter.type.getText(sourceFile) : "any";
                parameterPosition = sourceFile.getLineAndCharacterOfPosition(parameter.name.getStart(sourceFile, false));
                parameterAccessModifier = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.PublicKeyword || x.kind == ts.SyntaxKind.ProtectedKeyword || x.kind == ts.SyntaxKind.PrivateKeyword) as ts.Modifier;
                parameterIsStatic = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.StaticKeyword) != null;
                parameterIsConst = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.ConstKeyword) != null;
                parameterIsReadOnly = parameter.modifiers?.find((x) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
                parameterStart = this.editor!.document.positionAt(parameter.getStart(sourceFile, false));
                parameterEnd = this.editor!.document.positionAt(parameter.getEnd());

                if (parameterAccessModifier)
                {
                    properties.push(new PropertyDeclarationNode(parameterName, parameterType, parameterAccessModifier.getText(sourceFile), parameterIsStatic, parameterIsConst || parameterIsReadOnly, parameterIsStatic, parentElement, [], this.getCommand(parameterPosition), parameterStart, parameterEnd));
                }
                else
                {
                    parameters.push(new Parameter(parameterName, parameterType));
                }
            }
        }

        constructorNode = new ConstructorDeclarationNode(parameters, parentElement, childElements, this.getCommand(position), start, end);

        return [constructorNode].concat(properties);
    }

    private getEnumDeclarationNode(sourceFile: ts.SourceFile, node: ts.EnumDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.EnumDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const enumName = identifier.escapedText.toString();
        const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

        return new EnumDeclarationNode(enumName, isExport, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getEnumMemberDeclarationNode(sourceFile: ts.SourceFile, node: ts.EnumMember, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const enumMemberName = identifier.escapedText.toString();
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

        return new EnumMemberDeclarationNode(enumMemberName, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getFunctionDeclarationNode(sourceFile: ts.SourceFile, node: ts.FunctionDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.FunctionDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const functionName = identifier.escapedText.toString();
        const parameters: Parameter[] = [];
        const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);
        const returnType = node.type?.getText(sourceFile) ?? null;
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

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

        return new FunctionDeclarationNode(functionName, isExport, parameters, returnType, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getGetterDeclarationNode(sourceFile: ts.SourceFile, node: ts.GetAccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.AccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        let identifier = <ts.Identifier>node.name;
        let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        let getterName = identifier.escapedText.toString();
        let getterType = node.type ? node.type.getText(sourceFile) : "any";
        let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        let end = this.editor!.document.positionAt(node.getEnd());
        let accessModifier = getterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
        let isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);

        return new GetterDeclarationNode(getterName, getterType, accessModifier, isStatic, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getIndexSignatureDeclarationNode(sourceFile: ts.SourceFile, node: ts.IndexSignatureDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        let position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
        let indexType = node.type ? node.type.getText(sourceFile) : "any";
        let indexIsReadOnly = false;
        let isStatic = false;
        let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        let end = this.editor!.document.positionAt(node.getEnd());

        if (node.modifiers)
        {
            indexIsReadOnly = node.modifiers?.find((x) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
            isStatic = node.modifiers?.find((x) => x.kind == ts.SyntaxKind.StaticKeyword) != null;
        }

        return new IndexSignatureDeclarationNode(indexType, isStatic, indexIsReadOnly, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getInterfaceDeclarationNode(sourceFile: ts.SourceFile, node: ts.InterfaceDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.InterfaceDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const interfaceName = identifier.escapedText.toString();
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());
        const isExport = hasKeyword(node, ts.SyntaxKind.ExportKeyword);


        return new InterfaceDeclarationNode(interfaceName, isExport, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getMethodDeclarationNode(sourceFile: ts.SourceFile, node: ts.MethodDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.MethodDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        let identifier = <ts.Identifier>node.name;
        let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        let methodName = identifier.escapedText.toString();
        let parameters: Parameter[] = [];
        let parameterName;
        let accessModifier = methodName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
        let isAbstract = hasKeyword(node, ts.SyntaxKind.AbstractKeyword);
        let isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
        let isAsync = hasKeyword(node, ts.SyntaxKind.AsyncKeyword);
        let returnType: string | null = null;
        let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        let end = this.editor!.document.positionAt(node.getEnd());

        // method parameters
        for (const parameter of node.parameters)
        {
            parameterName = (<ts.Identifier>parameter.name).escapedText.toString();

            if (parameter.type)
            {
                parameters.push(new Parameter(parameterName, parameter.type.getText(sourceFile)));
            }
            else
            {
                parameters.push(new Parameter(parameterName, "any"));
            }
        }

        // method return type
        if (node.type)
        {
            returnType = node.type.getText(sourceFile);
        }

        return new MethodDeclarationNode(methodName, accessModifier, isStatic, isAbstract, isAsync, parameters, returnType, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getMethodSignatureDeclarationNode(sourceFile: ts.SourceFile, node: ts.MethodSignature, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        let identifier = <ts.Identifier>node.name;
        let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        let methodName = identifier.escapedText.toString();
        let parameters: Parameter[] = [];
        let parameterName;
        let returnType: string | null = null;
        let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        let end = this.editor!.document.positionAt(node.getEnd());

        // method parameters
        for (const parameter of node.parameters)
        {
            parameterName = (<ts.Identifier>parameter.name).escapedText.toString();

            if (parameter.type)
            {
                parameters.push(new Parameter(parameterName, parameter.type.getText(sourceFile)));
            }
            else
            {
                parameters.push(new Parameter(parameterName, "any"));
            }
        }

        // method return type
        if (node.type)
        {
            returnType = node.type.getText(sourceFile);
        }

        return new MethodSignatureDeclarationNode(methodName, parameters, returnType, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getOrder(declarationNode: DeclarationNode)
    {
        // module member types
        if (declarationNode instanceof EnumDeclarationNode)
        {
            return 101;
        }
        if (declarationNode instanceof InterfaceDeclarationNode)
        {
            return 102;
        }
        else if (declarationNode instanceof ClassDeclarationNode)
        {
            return 103;
        }
        else if (declarationNode instanceof TypeAliasDeclarationNode)
        {
            return 104;
        }
        else if (declarationNode instanceof VariableDeclarationNode)
        {
            return 105;
        }
        else if (declarationNode instanceof FunctionDeclarationNode)
        {
            return 106;
        }

        // interface / type alias member types
        if (declarationNode instanceof PropertySignatureDeclarationNode)
        {
            return 201;
        }
        else if (declarationNode instanceof IndexSignatureDeclarationNode)
        {
            return 202;
        }
        else if (declarationNode instanceof MethodSignatureDeclarationNode)
        {
            return 203;
        }

        // enum member types
        if (declarationNode instanceof EnumMemberDeclarationNode)
        {
            return 301;
        }

        // class member types
        if (declarationNode instanceof PropertyDeclarationNode)
        {
            let propertyDeclaration = <PropertyDeclarationNode>declarationNode;

            if (propertyDeclaration.isReadOnly) 
            {
                return 401;
            }
            else if (propertyDeclaration.accessModifier == "private")
            {
                return 402;
            }
            else
            {
                return 403;
            }
        }
        else if (declarationNode instanceof AccessorDeclarationNode)
        {
            return 404;
        }
        else if (declarationNode instanceof GetterDeclarationNode)
        {
            return 405;
        }
        else if (declarationNode instanceof SetterDeclarationNode)
        {
            return 405;
        }
        else if (declarationNode instanceof ConstructorDeclarationNode)
        {
            return 406;
        }
        else if (declarationNode instanceof StaticCodeBlockDeclarationNode)
        {
            return 407;
        }
        else if (declarationNode instanceof MethodDeclarationNode)
        {
            return 408;
        }

        // empty
        if (declarationNode instanceof EmptyDeclarationNode)
        {
            return 501;
        }

        return 601;
    }

    private getPropertyDeclarationNode(sourceFile: ts.SourceFile, node: ts.PropertyDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.PropertyDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        let identifier = <ts.Identifier>node.name;
        let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        let propertyName = identifier.escapedText.toString();
        let propertyType = node.type ? node.type.getText(sourceFile) : "any";
        let accessModifier = propertyName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
        let isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);
        let isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
        let isArrowFunction = typeof node.initializer !== "undefined" && node.initializer.kind === ts.SyntaxKind.ArrowFunction;
        let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        let end = this.editor!.document.positionAt(node.getEnd());

        return new PropertyDeclarationNode(propertyName, propertyType, accessModifier, isStatic, isReadOnly, isArrowFunction, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getPropertySignatureDeclarationNode(sourceFile: ts.SourceFile, node: ts.PropertySignature, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.PropertySignature, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const propertyName = identifier.escapedText.toString();
        const propertyType = node.type ? node.type.getText(sourceFile) : "any";
        const isReadOnly = hasKeyword(node, ts.SyntaxKind.ReadonlyKeyword);
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

        return new PropertySignatureDeclarationNode(propertyName, propertyType, isReadOnly, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getSetterDeclarationNode(sourceFile: ts.SourceFile, node: ts.SetAccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const hasKeyword = (node: ts.SetAccessorDeclaration, keyword: ts.SyntaxKind) => (node.modifiers ?? []).map(m => m.kind).some(m => m == keyword);

        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const setterName = identifier.escapedText.toString();
        const setterType = node.type ? node.type.getText(sourceFile) : "any";
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());
        const accessModifier = setterName.startsWith("#") || hasKeyword(node, ts.SyntaxKind.PrivateKeyword) ? "private" : (hasKeyword(node, ts.SyntaxKind.ProtectedKeyword) ? "protected" : "public");
        const isStatic = hasKeyword(node, ts.SyntaxKind.StaticKeyword);

        return new SetterDeclarationNode(setterName, setterType, accessModifier, isStatic, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getStaticBlockDeclarationNode(sourceFile: ts.SourceFile, node: ts.ClassStaticBlockDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

        return new StaticCodeBlockDeclarationNode(parentElement, childElements, this.getCommand(position), start, end);
    }

    private getTypeAliasDeclarationNode(sourceFile: ts.SourceFile, node: ts.TypeAliasDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
    {
        const identifier = <ts.Identifier>node.name;
        const position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
        const typeAliasName = identifier.escapedText.toString();
        const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
        const end = this.editor!.document.positionAt(node.getEnd());

        return new TypeAliasDeclarationNode(typeAliasName, parentElement, childElements, this.getCommand(position), start, end);
    }

    private getVariableDeclarationNode(sourceFile: ts.SourceFile, node: ts.VariableStatement, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
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
            const start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
            const end = this.editor!.document.positionAt(node.getEnd());

            variableDeclarationNodes.push(new VariableDeclarationNode(variableName, variableType, isExport, isConst, parentElement, childElements, this.getCommand(position), start, end));
        }

        return variableDeclarationNodes;
    }

    private visitSyntaxTree(node: ts.Node, sourceFile: ts.SourceFile, parentElement: DeclarationNode | null): DeclarationNode[]
    {
        let nodes: DeclarationNode[] = [];
        let childElements: DeclarationNode[] = [];

        // enum elements
        if (ts.isEnumDeclaration(node))
        {
            nodes.push(this.getEnumDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isEnumMember(node))
        {
            nodes.push(this.getEnumMemberDeclarationNode(sourceFile, node, parentElement, childElements));
        }

        // interface / type alias elements
        if (ts.isInterfaceDeclaration(node))
        {
            nodes.push(this.getInterfaceDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isTypeAliasDeclaration(node))
        {
            nodes.push(this.getTypeAliasDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isPropertySignature(node))
        {
            nodes.push(this.getPropertySignatureDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isIndexSignatureDeclaration(node))
        {
            nodes.push(this.getIndexSignatureDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isMethodSignature(node))
        {
            nodes.push(this.getMethodSignatureDeclarationNode(sourceFile, node, parentElement, childElements));
        }

        // class elements
        if (ts.isClassDeclaration(node))
        {
            nodes.push(this.getClassDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isConstructorDeclaration(node))
        {
            this.getConstructorDeclarationNode(sourceFile, node, parentElement, childElements).forEach(n => nodes.push(n));
        }
        else if (ts.isClassStaticBlockDeclaration(node))
        {
            nodes.push(this.getStaticBlockDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isPropertyDeclaration(node))
        {
            nodes.push(this.getPropertyDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isGetAccessor(node))
        {
            nodes.push(this.getGetterDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isSetAccessor(node))
        {
            nodes.push(this.getSetterDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isAccessor(node))
        {
            nodes.push(this.getAccessorDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isMethodDeclaration(node))
        {
            nodes.push(this.getMethodDeclarationNode(sourceFile, node, parentElement, childElements));
        }

        // module elements
        if (ts.isFunctionDeclaration(node))
        {
            nodes.push(this.getFunctionDeclarationNode(sourceFile, node, parentElement, childElements));
        }
        else if (ts.isVariableStatement(node))
        {
            this.getVariableDeclarationNode(sourceFile, node, parentElement, childElements).forEach(n => nodes.push(n));
        }

        // get child elements
        for (let childNode of node.getChildren(sourceFile))
        {
            for (let childElement of this.visitSyntaxTree(childNode, sourceFile, nodes.length > 0 ? nodes[0] : parentElement))
            {
                childElements.push(childElement);
            }
        }

        if (nodes.length == 0)
        {
            return childElements.sort((a, b) => this.compare(a, b));
        }
        else
        {
            nodes.forEach(x => x.collapsibleState = x.children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);

            return nodes;
        }
    }

    // #endregion Private Methods (22)
}
