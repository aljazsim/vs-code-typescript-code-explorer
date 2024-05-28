import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class PropertySignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(propertyName: string, propertyType: string, isReadOnly: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = propertyName;
        this.label = `${propertyName}: ${propertyType}`;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isReadOnly)
        {
            this.iconPath = {
                light: this.constantLightIconFilePath,
                dark: this.constantDarkIconFilePath
            };
        }
        else
        {
            this.iconPath = {
                light: this.propertyLightIconFilePath,
                dark: this.propertyDarkIconFilePath
            };
        }
    }

    // #endregion Constructors (1)
}
