import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class TypeAliasDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, public readonly isExport: boolean, parent: Node | null, children: Node[], command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, children, command, start, end);

        this.label = name;

        this.command = command;

        this.iconPath = {
            dark: this.getIconPath(configuration, isExport),
            light: this.getIconPath(configuration, isExport)
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getIconPath(configuration: Configuration, isExport: boolean)
    {
        if (!configuration.showAccessorColorCoding || isExport)
        {
            return NodeImages.typeExported;
        }
        else if (configuration.showAccessorColorCoding && !isExport)
        {
            return NodeImages.type;
        }
    }

    // #endregion Private Methods (1)
}
