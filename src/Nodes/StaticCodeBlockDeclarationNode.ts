import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class StaticCodeBlockDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = "static block declaration";
        this.label = this.name;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: this.staticCodeBlocLightIconFilePath,
            dark: this.staticCodeBlocDarkIconFilePath
        };
    }

    // #endregion Constructors (1)
}
