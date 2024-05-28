import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class AccessorDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(accessorName: string, accessorType: string, public accessModifier: string, public isStatic: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = accessorName;
        this.label = `${accessorName}: ${accessorType}`;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: this.accessorLightIconFilePath,
            dark: this.accessorDarkIconFilePath
        };

        if (accessModifier == "protected")
        {
            this.label += " " + this.protectedImage;
        }

        if (accessModifier == "private")
        {
            this.label += " " + this.privateImage;
        }
    }

    // #endregion Constructors (1)
}
