import * as vscode from "vscode";

export abstract class DeclarationNode extends vscode.TreeItem
{
    // #region Properties (5)

    public children: DeclarationNode[] = [];
    public end: vscode.Position = new vscode.Position(0, 0);
    public name = "";
    public parent: DeclarationNode | null = null;
    public start: vscode.Position = new vscode.Position(0, 0);

    // #endregion Properties (5)

    // #region Constructors (1)

    constructor()
    {
        super("", vscode.TreeItemCollapsibleState.Expanded);
    }

    // #endregion Constructors (1)
}
