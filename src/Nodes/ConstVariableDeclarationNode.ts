import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class ConstVariableDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, type: string, public readonly isExport: boolean, parent: Node | null, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? `: ${type}` : "";

        this.getIconPath(configuration, isExport);
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getIconPath(configuration: Configuration, isExport: boolean)
    {
        if (configuration.showAccessorColorCoding && isExport)
        {
            return NodeImages.constVariableExported;
        }
        else if (configuration.showAccessorColorCoding && !isExport)
        {
            return NodeImages.constVariable;
        }

        else
        {
            return NodeImages.readonlyPropertyPrivate;
        }
    }

    // #endregion Private Methods (1)
}
