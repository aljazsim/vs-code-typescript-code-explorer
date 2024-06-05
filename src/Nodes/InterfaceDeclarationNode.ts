import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class InterfaceDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(interfaceName: string, public readonly isExport: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = interfaceName;
        this.label = interfaceName;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.interfaceExported,
                dark: NodeImages.interfaceExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.interface,
                dark: NodeImages.interface
            };
        }
    }

    // #endregion Constructors (1)
}
