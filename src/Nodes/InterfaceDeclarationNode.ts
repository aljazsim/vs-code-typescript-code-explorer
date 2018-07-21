import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class InterfaceDeclarationNode extends DeclarationNode
{
	constructor(interfaceName: string, isExport: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
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
			light: path.join(this.imageDir, 'Interface_light.svg'),
			dark: path.join(this.imageDir, 'Interface_dark.svg')
		};

		if (!isExport)
		{
			this.label += " " + this.privateImage;
		}
	}
}