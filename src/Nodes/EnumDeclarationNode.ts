import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class EnumDeclarationNode extends DeclarationNode
{
	constructor(enumName: string, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = enumName;
		this.label = enumName;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, 'Enumerator_light.svg'),
			dark: path.join(this.imageDir, 'Enumerator_dark.svg')
		};
	}
}