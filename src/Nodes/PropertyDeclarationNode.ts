import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class PropertyDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(propertyName: string, propertyType: string, public accessModifier: string, public isStatic: boolean, public readonly isReadOnly: boolean, public readonly isArrowFunction: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
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


            if (accessModifier == "protected")
            {
                this.label += " " + this.protectedImage;
            }

            if (accessModifier == "private")
            {
                this.label += " " + this.privateImage;
            }
        }
        else if (accessModifier == "public" || accessModifier == "protected")
        {
            this.iconPath = {
                light: this.propertyLightIconFilePath,
                dark: this.propertyDarkIconFilePath
            };


            if (accessModifier == "protected")
            {
                this.label += " " + this.protectedImage;
            }
        }
        else
        {
            this.iconPath = {
                light: this.fieldItemLightIconFilePath,
                dark: this.fieldItemDarkIconFilePath
            };
        }
    }

    // #endregion Constructors (1)
}
