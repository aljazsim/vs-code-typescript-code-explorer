import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class PropertySignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, type: string, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? `: ${type}` : "";

        this.command = command;

        this.iconPath = {
            dark: this.getIconPath(configuration),
            light: this.getIconPath(configuration)
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getIconPath(configuration: Configuration)
    {
        if (configuration.showAccessorColorCoding)
        {
            return NodeImages.propertyPublic;
        }
        else
        {
            return NodeImages.propertyPrivate;
        }
    }

    // #endregion Private Methods (1)
}
