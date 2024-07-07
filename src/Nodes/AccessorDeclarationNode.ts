import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class AccessorDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(accessorName: string, accessorType: string | null, public accessModifier: string, public isStatic: boolean, public isAbstract: boolean, parent: DeclarationNode, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = accessorName;
        this.label = accessorName;
        this.description = accessorType ? `: ${accessorType}` : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
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
