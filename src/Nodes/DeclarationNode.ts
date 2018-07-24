import * as path from "path";
import * as vscode from "vscode";

export abstract class DeclarationNode extends vscode.TreeItem
{
	// #region Properties (8)

	protected readonly imageDir = path.join(__filename, "..", "..", "..", "..", "resources");
	protected readonly privateImage = this.convertHexToString("f09f9492");
	protected readonly protectedImage = this.convertHexToString("f09f9493");

	public children: DeclarationNode[] = [];
	public end: vscode.Position = new vscode.Position(0, 0);
	public name: string | null = null;
	public parent: DeclarationNode | null = null;
	public start: vscode.Position = new vscode.Position(0, 0);

	// #endregion

	// #region Constructors (1)

	constructor()
	{
		super("", vscode.TreeItemCollapsibleState.Expanded);
	}

	// #endregion

	// #region Public Accessors (1)

	public get tooltip(): string
	{
		return this.label!;
	}

	// #endregion

	// #region Protected Methods (1)

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

	// #endregion
}