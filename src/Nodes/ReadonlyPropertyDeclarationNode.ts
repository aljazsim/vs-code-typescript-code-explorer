import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class ReadonlyPropertyDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(propertyName: string, propertyType: string| null, public readonly accessModifier: string, public readonly isStatic: boolean, public readonly isAbstract: boolean, parent: DeclarationNode, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = propertyName;
        this.label = propertyName;
        this.description = propertyType ? `: ${propertyType}` : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
        this.command = command;

        if (accessModifier === "private")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.readonlyPropertyPrivateStatic : NodeImages.readonlyPropertyPrivate,
                dark: isStatic ? NodeImages.readonlyPropertyPrivateStatic : NodeImages.readonlyPropertyPrivate
            };
        }
        else if (accessModifier === "protected")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.readonlyPropertyProtectedStatic : NodeImages.readonlyPropertyProtected,
                dark: isStatic ? NodeImages.readonlyPropertyProtectedStatic : NodeImages.readonlyPropertyProtected
            };
        }
        else if (accessModifier === "public")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.readonlyPropertyPublicStatic : NodeImages.readonlyPropertyPublic,
                dark: isStatic ? NodeImages.readonlyPropertyPublicStatic : NodeImages.readonlyPropertyPublic
            };
        }
    }

    // #endregion Constructors (1)
}
