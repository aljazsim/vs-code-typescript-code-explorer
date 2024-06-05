import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class TypeAliasDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(typeName: string, public readonly isExport: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = typeName;
        this.label = typeName;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.typeExported,
                dark: NodeImages.typeExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.type,
                dark: NodeImages.type
            };
        }
    }

    // #endregion Constructors (1)
}
