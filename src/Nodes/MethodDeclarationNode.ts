import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";
import { Parameter } from "./Parameter";

export class MethodDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

	constructor(methodName: string, accessModifier: string, isStatic: boolean, isAbstract: boolean, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = methodName;
		this.label = `${methodName} (${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})`;

		if (returnType)
		{
			this.label = `${this.label}: ${returnType}`;
		}

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Method_light.svg'),
			dark: path.join(this.imageDir, 'Method_dark.svg')
		};

		if (accessModifier == "protected")
		{
			this.label += " " + this.protectedImage;
		}

		if (accessModifier == "private")
		{
			this.label += " " + this.privateImage;
		}
	}

	// #endregion
}