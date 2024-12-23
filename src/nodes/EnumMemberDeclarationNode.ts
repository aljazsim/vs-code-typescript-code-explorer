import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class EnumMemberDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, value: string | null, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? (value === null ? "" : `= ${value}`) : "";

        this.command = command;

        this.iconPath = {
            light: NodeImages.enumMember,
            dark: NodeImages.enumMember
        };
    }

    // #endregion Constructors (1)
}
