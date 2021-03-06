import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class GetterDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

	constructor(getterName: string, getterType: string, public accessModifier: string, public isStatic: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = getterName;
		this.label = `${getterName}: ${getterType}`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Getter_light.svg'),
			dark: path.join(this.imageDir, 'Getter_dark.svg')
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
