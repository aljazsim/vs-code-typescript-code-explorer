import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class PropertyDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(propertyName: string, propertyType: string, public accessModifier: string, public isStatic: boolean, public isAbstract: boolean, public readonly isReadOnly: boolean, public readonly isArrowFunction: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
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
        this.contextValue = isReadOnly ? "readonly" : undefined;

        if (accessModifier === "private")
        {
            this.iconPath = {
                light: isStatic ? this.propertyPrivateStatic : this.propertyPrivate,
                dark: isStatic ? this.propertyPrivateStatic : this.propertyPrivate
            };
        }
        else if (accessModifier === "protected")
        {
            this.iconPath = {
                light: isStatic ? this.propertyProtectedStatic : this.propertyProtected,
                dark: isStatic ? this.propertyProtectedStatic : this.propertyProtected
            };
        }
        else if (accessModifier === "public")
        {
            this.iconPath = {
                light: isStatic ? this.propertyPublicStatic : this.propertyPublic,
                dark: isStatic ? this.propertyPublicStatic : this.propertyPublic
            };
        }
    }

    // #endregion Constructors (1)
}
