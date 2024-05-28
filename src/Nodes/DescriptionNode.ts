import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class DescriptionNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(description: string, parent: DeclarationNode | null = null, children: DeclarationNode[])
    {
        super();

        this.label = description;

        this.start = new vscode.Position(0, 0);
        this.end = new vscode.Position(0, 0);

        this.parent = parent;
        this.children = children;
        this.command = undefined;

        this.iconPath = undefined;
        this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    }

    // #endregion Constructors (1)
}
