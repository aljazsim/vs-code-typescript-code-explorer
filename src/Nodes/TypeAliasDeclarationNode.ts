import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class TypeAliasDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(interfaceName: string, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = interfaceName;
        this.label = interfaceName;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: this.structureLightIconFilePath,
            dark: this.structureDarkIconFilePath
        };
    }

    // #endregion Constructors (1)
}
