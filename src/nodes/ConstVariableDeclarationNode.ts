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

        if (configuration.showAccessorColorCoding && isExport)
        {
            this.iconPath = {
                light: NodeImages.constVariableExported,
                dark: NodeImages.constVariableExported
            };
        }
        else if (configuration.showAccessorColorCoding && !isExport)
        {
            this.iconPath = {
                light: NodeImages.constVariable,
                dark: NodeImages.constVariable
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.readonlyPropertyPrivate,
                dark: NodeImages.readonlyPropertyPrivate
            };
        }
    }

    // #endregion Constructors (1)
}
