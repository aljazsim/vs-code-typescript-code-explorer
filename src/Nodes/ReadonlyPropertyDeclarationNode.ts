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
                light: isStatic ? NodeImages.constPrivateStatic : NodeImages.constPrivate,
                dark: isStatic ? NodeImages.constPrivateStatic : NodeImages.constPrivate
            };
        }
        else if (accessModifier === "protected")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.constProtectedStatic : NodeImages.constProtected,
                dark: isStatic ? NodeImages.constProtectedStatic : NodeImages.constProtected
            };
        }
        else if (accessModifier === "public")
        {
            this.iconPath = {
                light: isStatic ? NodeImages.constPublicStatic : NodeImages.constPublic,
                dark: isStatic ? NodeImages.constPublicStatic : NodeImages.constPublic
            };
        }
    }

    // #endregion Constructors (1)
}
