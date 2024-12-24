import * as vscode from "vscode";
import { Node } from "./Node";

export abstract class DeclarationNode extends Node
{
    // #region Properties (3)

    public readonly end: vscode.Position = new vscode.Position(0, 0);
    public readonly name: string = "";
    public readonly start: vscode.Position = new vscode.Position(0, 0);

    // #endregion Properties (3)

    // #region Constructors (1)

    constructor(name: string, parent: Node | null, children: Node[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super("", vscode.TreeItemCollapsibleState.Expanded);

        this.name = name;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;
    }

    // #endregion Constructors (1)
}
