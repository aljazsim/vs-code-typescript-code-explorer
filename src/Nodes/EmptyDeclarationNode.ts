import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class EmptyDeclarationNode extends DeclarationNode
{
	constructor()
	{
		super();

		this.label = "no elements found";

		this.start = new vscode.Position(0, 0);
		this.end = new vscode.Position(0, 0);

		this.parent = null;
		this.children = [];
		this.command = undefined;

		this.iconPath = undefined;
		this.collapsibleState = vscode.TreeItemCollapsibleState.None;
	}
}