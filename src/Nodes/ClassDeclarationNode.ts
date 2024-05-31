import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class ClassDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(className: string, isExport: boolean, isAbstract: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = className;
        this.label = className;
        this.description = isAbstract ? "abstract" : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: this.classLightIconFilePath,
            dark: this.classDarkIconFilePath
        };

        if (!isExport)
        {
        }
    }

    // #endregion Constructors (1)
}
