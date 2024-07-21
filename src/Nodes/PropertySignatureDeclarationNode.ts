import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/configuration";
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

        if (configuration.showAccessorColorCoding)
        {
            this.iconPath = {
                light: NodeImages.propertyPublic,
                dark: NodeImages.propertyPublic
            };
        }
        else {
            this.iconPath = {
                light: NodeImages.propertyPrivate,
                dark: NodeImages.propertyPrivate
            };
        }
    }

    // #endregion Constructors (1)
}
