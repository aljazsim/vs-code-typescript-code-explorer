import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class ClassDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

	constructor(className: string, isExport: boolean, isAbstract: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = className;
		this.label = className;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Class_light.svg'),
			dark: path.join(this.imageDir, 'Class_dark.svg')
		};

		if (!isExport)
		{
			this.label += " " + this.privateImage;
		}
	}

	// #endregion
}
