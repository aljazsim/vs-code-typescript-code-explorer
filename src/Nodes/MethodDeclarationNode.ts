import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { Parameter } from "./Parameter";

export class MethodDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(methodName: string, accessModifier: string, isStatic: boolean, isAbstract: boolean, isAsync: boolean, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = methodName;
        this.label = methodName;
        this.description = `(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})${(returnType ? `: ${returnType}` : ": void")}`;

        if (isAsync)
        {
            this.description += " " + this.asyncCharacter;
        }

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (accessModifier === "private")
        {
            this.iconPath = {
                light: isStatic ? this.methodPrivateStatic : this.methodPrivate,
                dark: isStatic ? this.methodPrivateStatic : this.methodPrivate
            };
        }
        else if (accessModifier === "protected")
        {
            this.iconPath = {
                light: isStatic ? this.methodProtectedStatic : this.methodProtected,
                dark: isStatic ? this.methodProtectedStatic : this.methodProtected
            };
        }
        else if (accessModifier === "public")
        {
            this.iconPath = {
                light: isStatic ? this.methodPublicStatic : this.methodPublic,
                dark: isStatic ? this.methodPublicStatic : this.methodPublic
            };
        }
    }

    // #endregion Constructors (1)
}
