import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class GetterDeclarationNode extends DeclarationNode
{
	constructor(getterName: string, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = getterName;
		this.label = getterName;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', 'Getter_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Getter_inverse_16x.svg')
		};
	}
}