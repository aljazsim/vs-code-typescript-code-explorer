import * as vscode from "vscode";

import { Node } from "./Node";

export class DescriptionNode extends Node
{
    // #region Constructors (1)

    constructor(description: string, public readonly parent: Node | null = null, public readonly children: Node[])
    {
        super("", vscode.TreeItemCollapsibleState.Expanded);

        this.description = description;

        this.parent = parent;
        this.children = children;
    }

    // #endregion Constructors (1)
}
