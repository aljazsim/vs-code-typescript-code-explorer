import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class GetterDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(getterName: string, getterType: string, public accessModifier: string, public isStatic: boolean, public isAbstract: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = getterName;
        this.label = getterName;
        this.description = getterType ? `: ${getterType}` : ": any";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

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
