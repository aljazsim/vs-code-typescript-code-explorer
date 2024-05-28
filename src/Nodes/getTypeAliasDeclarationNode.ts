import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class TypeAliasDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

	constructor(interfaceName: string, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = interfaceName;
		this.label = interfaceName;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Class_light.svg'),
			dark: path.join(this.imageDir, 'Class_dark.svg')
		};
	}

	// #endregion Constructors (1)
}
