import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class IndexSignatureDeclarationNode extends DeclarationNode
{
	constructor(indexType: string, isReadOnly: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = indexType;
		this.label = `index: ${indexType}`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', 'Property_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Property_inverse_16x.svg')
		};
	}
}