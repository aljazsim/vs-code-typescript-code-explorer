import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class VariableDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, type: string, public readonly isExport: boolean, parent: Node | null, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? `: ${type}` : "";

        this.command = command;

        if (configuration.showAccessorColorCoding && isExport)
        {
            this.iconPath = {
                light: NodeImages.variableExported,
                dark: NodeImages.variableExported
            };
        }
        else if (configuration.showAccessorColorCoding && !isExport)
        {
            this.iconPath = {
                light: NodeImages.variable,
                dark: NodeImages.variable
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.propertyPrivate,
                dark: NodeImages.propertyPrivate
            };
        }
    }

    // #endregion Constructors (1)
}
