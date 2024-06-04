import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class EnumDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(enumName: string, isExport: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = enumName;
        this.label = enumName;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.enumExported,
                dark: NodeImages.enumExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.enum,
                dark: NodeImages.enum
            };
        }
    }

    // #endregion Constructors (1)
}
