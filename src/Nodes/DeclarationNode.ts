import * as vscode from "vscode";

export abstract class DeclarationNode extends vscode.TreeItem
{
	public name: string | null = null;
	public parent: DeclarationNode | null = null;
	public children: DeclarationNode[] = [];
	public start: vscode.Position = new vscode.Position(0, 0);
	public end: vscode.Position = new vscode.Position(0, 0);

	constructor()
	{
		super("", vscode.TreeItemCollapsibleState.Expanded);
	}

	get tooltip(): string
	{
		return this.label!;
	}
}