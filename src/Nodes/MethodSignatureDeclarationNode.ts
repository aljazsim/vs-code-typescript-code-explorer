import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class MethodSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(methodName: string, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = methodName;
        this.label = methodName;
        this.description = `(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})${(returnType ? `: ${returnType}` : "")}`;


        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: NodeImages.methodPublic,
            dark: NodeImages.methodPublic
        };
    }

    // #endregion Constructors (1)
}
