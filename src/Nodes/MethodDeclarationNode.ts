import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class MethodDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(methodName: string, public readonly accessModifier: string, public readonly isStatic: boolean, public readonly isAbstract: boolean, public readonly isAsync: boolean, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = methodName;
        this.label = methodName;
        this.description = `(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})${(returnType ? `: ${returnType}` : ": void")}`;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isAsync)
        {
            if (isStatic)
            {
                if (accessModifier === "private")
                {
                    this.iconPath = {
                        light: NodeImages.methodPrivateStaticAsync,
                        dark: NodeImages.methodPrivateStaticAsync
                    };
                }
                else if (accessModifier === "protected")
                {
                    this.iconPath = {
                        light: NodeImages.methodProtectedStaticAsync,
                        dark: NodeImages.methodProtectedStaticAsync
                    };
                }
                else if (accessModifier === "public")
                {
                    this.iconPath = {
                        light: NodeImages.methodPublicStaticAsync,
                        dark: NodeImages.methodPublicStaticAsync
                    };
                }
            }
            else if (isAbstract)
            {
                if (accessModifier === "protected")
                {
                    this.iconPath = {
                        light: NodeImages.methodProtectedAbstractAsync,
                        dark: NodeImages.methodProtectedAbstractAsync
                    };
                }
                else if (accessModifier === "public")
                {
                    this.iconPath = {
                        light: NodeImages.methodPublicAbstractAsync,
                        dark: NodeImages.methodPublicAbstractAsync
                    };
                }
            }
            else
            {
                if (accessModifier === "private")
                {
                    this.iconPath = {
                        light: NodeImages.methodPrivateStaticAsync,
                        dark: NodeImages.methodPrivateStaticAsync
                    };
                }
                else if (accessModifier === "protected")
                {
                    this.iconPath = {
                        light: NodeImages.methodProtectedAsync,
                        dark: NodeImages.methodProtectedAsync
                    };
                }
                else if (accessModifier === "public")
                {
                    this.iconPath = {
                        light: NodeImages.methodPublicAsync,
                        dark: NodeImages.methodPublicAsync
                    };
                }
            }

        }
        else 
        {
            if (isStatic)
            {
                if (accessModifier === "private")
                {
                    this.iconPath = {
                        light: NodeImages.methodPrivateStatic,
                        dark: NodeImages.methodPrivateStatic
                    };
                }
                else if (accessModifier === "protected")
                {
                    this.iconPath = {
                        light: NodeImages.methodProtectedStatic,
                        dark: NodeImages.methodProtectedStatic
                    };
                }
                else if (accessModifier === "public")
                {
                    this.iconPath = {
                        light: NodeImages.methodPublicStatic,
                        dark: NodeImages.methodPublicStatic
                    };
                }
            }
            else if (isAbstract)
            {
                if (accessModifier === "protected")
                {
                    this.iconPath = {
                        light: NodeImages.methodProtectedAbstract,
                        dark: NodeImages.methodProtectedAbstract
                    };
                }
                else if (accessModifier === "public")
                {
                    this.iconPath = {
                        light: NodeImages.methodPublicAbstract,
                        dark: NodeImages.methodPublicAbstract
                    };
                }
            }
            else
            {
                if (accessModifier === "private")
                {
                    this.iconPath = {
                        light: NodeImages.methodPrivateStatic,
                        dark: NodeImages.methodPrivateStatic
                    };
                }
                else if (accessModifier === "protected")
                {
                    this.iconPath = {
                        light: NodeImages.methodProtected,
                        dark: NodeImages.methodProtected
                    };
                }
                else if (accessModifier === "public")
                {
                    this.iconPath = {
                        light: NodeImages.methodPublic,
                        dark: NodeImages.methodPublic
                    };
                }
            }

        }
    }

    // #endregion Constructors (1)
}
