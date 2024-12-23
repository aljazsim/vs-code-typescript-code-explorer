import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class InterfaceDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, public readonly isExport: boolean, parent: Node | null, children: Node[], command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, children, command, start, end);

        this.label = name;

        this.command = command;

        if (!configuration.showAccessorColorCoding || isExport)
        {
            this.iconPath = {
                light: NodeImages.interfaceExported,
                dark: NodeImages.interfaceExported
            };
        }
        else if (configuration.showAccessorColorCoding && isExport)
        {
            this.iconPath = {
                light: NodeImages.interface,
                dark: NodeImages.interface
            };
        }
    }

    // #endregion Constructors (1)
}
