import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class PropertySignatureDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

	constructor(propertyName: string, propertyType: string, isConst: boolean, isReadOnly: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = propertyName;
		this.label = `${propertyName}: ${propertyType}`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Property_light.svg'),
			dark: path.join(this.imageDir, 'Property_dark.svg')
		};
	}

	// #endregion Constructors (1)
}
