import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class InterfaceDeclarationNode extends DeclarationNode
{
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
			light: path.join(__filename, '..', '..', '..', 'resources', 'Interface_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Interface_inverse_16x.svg')
		};
	}
}