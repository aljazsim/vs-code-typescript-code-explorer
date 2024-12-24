import { Node } from "./Node";
import * as vscode from "vscode";

export class EmptyNode extends Node
{
    // #region Constructors (1)

    constructor()
    {
        super("", vscode.TreeItemCollapsibleState.None);

        this.description = "no elements found";
    }

    // #endregion Constructors (1)
}
