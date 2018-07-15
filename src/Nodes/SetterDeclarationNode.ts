import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class SetterDeclarationNode extends DeclarationNode
{
	constructor(setterName: string, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = setterName;
		this.label = setterName;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', 'Setter_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Setter_inverse_16x.svg')
		};
	}
}