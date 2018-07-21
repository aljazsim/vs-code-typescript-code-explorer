import * as path from "path";
import * as vscode from "vscode";

export abstract class DeclarationNode extends vscode.TreeItem
{
	public name: string | null = null;
	public parent: DeclarationNode | null = null;
	public children: DeclarationNode[] = [];
	public start: vscode.Position = new vscode.Position(0, 0);
	public end: vscode.Position = new vscode.Position(0, 0);
	protected readonly imageDir = path.join(__filename, "..", "..", "..", "..", "resources");
	protected readonly privateImage = this.convertHexToString("f09f9492");
	protected readonly protectedImage = this.convertHexToString("f09f9493");

	constructor()
	{
		super("", vscode.TreeItemCollapsibleState.Expanded);
	}

	get tooltip(): string
	{
		return this.label!;
	}

	protected convertHexToString(input: string)
	{
		var inputHex = input.match(/[\s\S]{2}/g) || [];
		var output = '';

		for (var i = 0, j = inputHex.length; i < j; i++)
		{
			output += '%' + ('0' + inputHex[i]).slice(-2);
		}

		output = decodeURIComponent(output);

		return output;
	}
}