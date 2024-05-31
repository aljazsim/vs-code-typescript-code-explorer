import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class EnumDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(enumName: string, isExport: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = enumName;
        this.label = enumName;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: this.enumeratorLightIconFilePath,
            dark: this.enumeratorDarkIconFilePath
        };

        if (!isExport)
        {
        }
    }

    // #endregion Constructors (1)
}
