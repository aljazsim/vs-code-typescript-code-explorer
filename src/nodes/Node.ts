import * as vscode from "vscode";

export abstract class Node extends vscode.TreeItem
{
    // #region Properties (2)

    public children: Node[] = [];
    public parent: Node | null = null;

    // #endregion Properties (2)
}
