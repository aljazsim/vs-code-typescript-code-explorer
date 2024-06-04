import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class EnumMemberDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(enumMemberName: string, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = enumMemberName;
        this.label = enumMemberName;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: NodeImages.enumMember,
            dark: NodeImages.enumMember
        };
    }

    // #endregion Constructors (1)
}
