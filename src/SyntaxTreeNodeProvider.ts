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

export class SyntaxTreeNodeProvider implements vscode.TreeDataProvider<DeclarationNode>
{
	// #region Properties (4)

	private _onDidChangeTreeData: vscode.EventEmitter<DeclarationNode | undefined> = new vscode.EventEmitter<DeclarationNode | undefined>();
	private editor: vscode.TextEditor | null = null;
	private rootElements: DeclarationNode[] = [new EmptyDeclarationNode()];

	public readonly onDidChangeTreeData: vscode.Event<DeclarationNode | undefined> = this._onDidChangeTreeData.event;

	// #endregion

	// #region Constructors (1)

	constructor(private workspaceRoot: string)
	{
	}

	// #endregion

	// #region Public Accessors (1)

	public get rootElement(): DeclarationNode
	{
		return this.rootElements[0];
	}

	// #endregion

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

		this._onDidChangeTreeData.fire();
	}

	// #endregion

	// #region Private Methods (18)

	private analyzeSyntaxTree(sourceCode: string)
	{
		let rootElements: DeclarationNode[] = [];
		let sourceFile: ts.SourceFile;

		// generate ast
		sourceFile = ts.createSourceFile("temp", sourceCode, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

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
			if (a.label!.toLowerCase() > b.label!.toLowerCase())
			{
				return 1;
			}
			else if (a.label!.toLowerCase() < b.label!.toLowerCase())
			{
				return -1;
			}
			else
			{
				return 0;
			}
		}
	}

	private getClassDeclarationNode(sourceFile: ts.SourceFile, node: ts.ClassDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let className = identifier.escapedText.toString();
		let isExport: boolean = false;
		let isAbstract: boolean = false;
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		// class modifiers
		if (node.modifiers)
		{
			let tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.ExportKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.ExportKeyword)
			{
				isExport = true;
			}

			tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.AbstractKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.AbstractKeyword)
			{
				isAbstract = true;
			}
		}

		return new ClassDeclarationNode(className, isExport, isAbstract, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getCommand(position: ts.LineAndCharacter)
	{
		let commandName = "tsce.goto";
		let position2 = new vscode.Position(position.line, position.character);
		let command = {
			command: commandName,
			title: '',
			arguments: [this.editor, position2]
		};

		return command;
	}

	private getConstructorDeclarationNode(sourceFile: ts.SourceFile, node: ts.ConstructorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
		let constructorName = "constructor";
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
				parameterAccessModifier = parameter.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.PublicKeyword || x.kind == ts.SyntaxKind.ProtectedKeyword || x.kind == ts.SyntaxKind.PrivateKeyword);
				parameterIsStatic = parameter.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.StaticKeyword) != null;
				parameterIsConst = parameter.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.ConstKeyword) != null;
				parameterIsReadOnly = parameter.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
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

		constructorNode = new ConstructorDeclarationNode(constructorName, parameters, parentElement, childElements, this.getCommand(position), start, end);

		return [constructorNode].concat(properties);
	}

	private getEnumDeclarationNode(sourceFile: ts.SourceFile, node: ts.EnumDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let enumName = identifier.escapedText.toString();
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		return new EnumDeclarationNode(enumName, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getEnumMemberDeclarationNode(sourceFile: ts.SourceFile, node: ts.EnumMember, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let enumMemberName = identifier.escapedText.toString();
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		return new EnumMemberDeclarationNode(enumMemberName, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getFunctionDeclarationNode(sourceFile: ts.SourceFile, node: ts.FunctionDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let functionName = identifier.escapedText.toString();
		let parameters: Parameter[] = [];
		let parameterName;
		let isExport: boolean = false;
		let returnType: string | null = null;
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		// function modifiers
		if (node.modifiers)
		{
			let tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.ExportKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.ExportKeyword)
			{
				isExport = true;
			}
		}

		// function parameters
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

		return new FunctionDeclarationNode(functionName, isExport, parameters, returnType, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getGetterDeclarationNode(sourceFile: ts.SourceFile, node: ts.AccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let getterName = identifier.escapedText.toString();
		let getterType = node.type ? node.type.getText(sourceFile) : "any";
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());
		let accessModifier: string = "public";
		let isStatic: boolean = false;

		if (node.modifiers)
		{
			let tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.PublicKeyword || modifier.kind == ts.SyntaxKind.ProtectedKeyword || modifier.kind == ts.SyntaxKind.PrivateKeyword);

			if (tmp)
			{
				if (tmp.kind === ts.SyntaxKind.PublicKeyword)
				{
					accessModifier = "public";
				}
				else if (tmp.kind === ts.SyntaxKind.ProtectedKeyword)
				{
					accessModifier = "protected";
				}
				else if (tmp.kind === ts.SyntaxKind.PrivateKeyword)
				{
					accessModifier = "private";
				}
			}

			tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.StaticKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.StaticKeyword)
			{
				isStatic = true;
			}
		}

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
			indexIsReadOnly = node.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
			isStatic = node.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.StaticKeyword) != null;
		}

		return new IndexSignatureDeclarationNode(indexType, isStatic, indexIsReadOnly, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getInterfaceDeclarationNode(sourceFile: ts.SourceFile, node: ts.InterfaceDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let interfaceName = identifier.escapedText.toString();
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());
		let isExport: boolean = false;

		// interface modifiers
		if (node.modifiers)
		{
			let tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.ExportKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.ExportKeyword)
			{
				isExport = true;
			}
		}

		return new InterfaceDeclarationNode(interfaceName, isExport, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getTypeAliasDeclarationNode(sourceFile: ts.SourceFile, node: ts.TypeAliasDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let typeAliasName = identifier.escapedText.toString();
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		return new TypeAliasDeclarationNode(typeAliasName, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getMethodDeclarationNode(sourceFile: ts.SourceFile, node: ts.MethodDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let methodName = identifier.escapedText.toString();
		let parameters: Parameter[] = [];
		let parameterName;
		let accessModifier: string = "public";
		let isAbstract: boolean = false;
		let isStatic: boolean = false;
		let returnType: string | null = null;
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		// method modifiers
		if (node.modifiers)
		{
			let tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.PublicKeyword || modifier.kind == ts.SyntaxKind.ProtectedKeyword || modifier.kind == ts.SyntaxKind.PrivateKeyword);

			if (tmp)
			{
				if (tmp.kind === ts.SyntaxKind.PublicKeyword)
				{
					accessModifier = "public";
				}
				else if (tmp.kind === ts.SyntaxKind.ProtectedKeyword)
				{
					accessModifier = "protected";
				}
				else if (tmp.kind === ts.SyntaxKind.PrivateKeyword)
				{
					accessModifier = "private";
				}
			}

			tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.StaticKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.StaticKeyword)
			{
				isStatic = true;
			}

			tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.AbstractKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.AbstractKeyword)
			{
				isAbstract = true;
			}
		}

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

		return new MethodDeclarationNode(methodName, accessModifier, isStatic, isAbstract, parameters, returnType, parentElement, childElements, this.getCommand(position), start, end);
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
		if (declarationNode instanceof InterfaceDeclarationNode)
		{
			return 101;
		}
		else if (declarationNode instanceof ClassDeclarationNode)
		{
			return 102;
		}
		else if (declarationNode instanceof EnumDeclarationNode)
		{
			return 103;
		}
		else if (declarationNode instanceof FunctionDeclarationNode)
		{
			return 104;
		}

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

		if (declarationNode instanceof EnumMemberDeclarationNode)
		{
			return 301;
		}

		else if (declarationNode instanceof PropertyDeclarationNode)
		{
			let propertyDeclaration = <PropertyDeclarationNode>declarationNode;

			if (propertyDeclaration.accessModifier == "private")
			{
				return 401;
			}
			else
			{
				return 402;
			}
		}
		else if (declarationNode instanceof GetterDeclarationNode)
		{
			return 402;
		}
		else if (declarationNode instanceof SetterDeclarationNode)
		{
			return 402;
		}
		else if (declarationNode instanceof ConstructorDeclarationNode)
		{
			return 403;
		}
		else if (declarationNode instanceof MethodDeclarationNode)
		{
			return 404;
		}

		if (declarationNode instanceof EmptyDeclarationNode)
		{
			return 501;
		}

		return 601;
	}

	private getPropertyDeclarationNode(sourceFile: ts.SourceFile, node: ts.PropertyDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let propertyName = identifier.escapedText.toString();
		let propertyType = node.type ? node.type.getText(sourceFile) : "any";
		let propertyAccessModifier = node.modifiers!.find((x, index, array) => x.kind == ts.SyntaxKind.PublicKeyword || x.kind == ts.SyntaxKind.ProtectedKeyword || x.kind == ts.SyntaxKind.PrivateKeyword);
		let propertyIsStatic = node.modifiers!.find((x, index, array) => x.kind == ts.SyntaxKind.StaticKeyword) != null;
		let propertyIsConst = node.modifiers!.find((x, index, array) => x.kind == ts.SyntaxKind.ConstKeyword) != null;
		let propertyIsReadOnly = node.modifiers!.find((x, index, array) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		return new PropertyDeclarationNode(propertyName, propertyType, propertyAccessModifier ? propertyAccessModifier.getText(sourceFile) : "public", propertyIsStatic, propertyIsConst, propertyIsReadOnly, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getPropertySignatureDeclarationNode(sourceFile: ts.SourceFile, node: ts.PropertySignature, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let propertyName = identifier.escapedText.toString();
		let propertyType = node.type ? node.type.getText(sourceFile) : "any";
		let propertyIsConst = false;
		let propertyIsReadOnly = false;
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());

		if (node.modifiers)
		{
			propertyIsConst = node.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.ConstKeyword) != null;
			propertyIsReadOnly = node.modifiers.find((x, index, array) => x.kind == ts.SyntaxKind.ReadonlyKeyword) != null;
		}

		return new PropertySignatureDeclarationNode(propertyName, propertyType, propertyIsConst, propertyIsReadOnly, parentElement, childElements, this.getCommand(position), start, end);
	}

	private getSetterDeclarationNode(sourceFile: ts.SourceFile, node: ts.AccessorDeclaration, parentElement: DeclarationNode | null, childElements: DeclarationNode[])
	{
		let identifier = <ts.Identifier>node.name;
		let position = sourceFile.getLineAndCharacterOfPosition(identifier.getStart(sourceFile, false));
		let setterName = identifier.escapedText.toString();
		let setterType = node.type ? node.type.getText(sourceFile) : "any";
		let start = this.editor!.document.positionAt(node.getStart(sourceFile, false));
		let end = this.editor!.document.positionAt(node.getEnd());
		let accessModifier: string = "public";
		let isStatic: boolean = false;

		if (node.modifiers)
		{
			let tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.PublicKeyword || modifier.kind == ts.SyntaxKind.ProtectedKeyword || modifier.kind == ts.SyntaxKind.PrivateKeyword);

			if (tmp)
			{
				if (tmp.kind === ts.SyntaxKind.PublicKeyword)
				{
					accessModifier = "public";
				}
				else if (tmp.kind === ts.SyntaxKind.ProtectedKeyword)
				{
					accessModifier = "protected";
				}
				else if (tmp.kind === ts.SyntaxKind.PrivateKeyword)
				{
					accessModifier = "private";
				}
			}

			tmp = node.modifiers.find((modifier, index, array) => modifier.kind == ts.SyntaxKind.StaticKeyword);

			if (tmp &&
				tmp.kind === ts.SyntaxKind.StaticKeyword)
			{
				isStatic = true;
			}
		}

		return new SetterDeclarationNode(setterName, setterType, accessModifier, isStatic, parentElement, childElements, this.getCommand(position), start, end);
	}

	private visitSyntaxTree(node: ts.Node, sourceFile: ts.SourceFile, parentElement: DeclarationNode | null): DeclarationNode[]
	{
		let elements: DeclarationNode[] = [];
		let childElements: DeclarationNode[] = [];

		// get element
		if (ts.isInterfaceDeclaration(node))
		{
			elements.push(this.getInterfaceDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isPropertySignature(node))
		{
			elements.push(this.getPropertySignatureDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isIndexSignatureDeclaration(node))
		{
			elements.push(this.getIndexSignatureDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isMethodSignature(node))
		{
			elements.push(this.getMethodSignatureDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isEnumDeclaration(node))
		{
			elements.push(this.getEnumDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isEnumMember(node))
		{
			elements.push(this.getEnumMemberDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isClassDeclaration(node))
		{
			elements.push(this.getClassDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isConstructorDeclaration(node))
		{
			elements = this.getConstructorDeclarationNode(sourceFile, node, parentElement, childElements);
		}
		else if (ts.isPropertyDeclaration(node))
		{
			elements.push(this.getPropertyDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isGetAccessor(node))
		{
			elements.push(this.getGetterDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isSetAccessor(node))
		{
			elements.push(this.getSetterDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isMethodDeclaration(node))
		{
			elements.push(this.getMethodDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isFunctionDeclaration(node))
		{
			elements.push(this.getFunctionDeclarationNode(sourceFile, node, parentElement, childElements));
		}
		else if (ts.isTypeAliasDeclaration(node))
		{
			elements.push(this.getTypeAliasDeclarationNode(sourceFile, node, parentElement, childElements));
		}

		// get child elements
		for (let childNode of node.getChildren(sourceFile))
		{
			for (let childElement of this.visitSyntaxTree(childNode, sourceFile, elements.length > 0 ? elements[0] : parentElement))
			{
				childElements.push(childElement);
			}
		}

		if (elements.length == 0)
		{
			return childElements.sort((a, b) => this.compare(a, b));
		}
		else
		{
			elements.forEach(x => x.collapsibleState = x.children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);

			return elements;
		}
	}

	// #endregion
}