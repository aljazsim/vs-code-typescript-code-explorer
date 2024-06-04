import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class PropertyDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(propertyName: string, propertyType: string, public readonly accessModifier: string, public readonly isStatic: boolean, public readonly isAbstract: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = propertyName;
        this.label = propertyName;
        this.description = propertyType ? `: ${propertyType}` : ": any";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (accessModifier === "private")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate,
                dark: isStatic ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate
            };
        }
        else if (accessModifier === "protected")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.propertyProtectedStatic : NodeImages.propertyProtected,
                dark: isStatic ? NodeImages.propertyProtectedStatic : NodeImages.propertyProtected
            };
        }
        else if (accessModifier === "public")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic,
                dark: isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic
            };
        }
    }

    // #endregion Constructors (1)
}
