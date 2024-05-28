import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class SetterDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

	constructor(setterName: string, setterType: string, public accessModifier: string, public isStatic: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = setterName;
		this.label = `${setterName}: ${setterType}`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Setter_light.svg'),
			dark: path.join(this.imageDir, 'Setter_dark.svg')
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

	// #endregion Constructors (1)
}
