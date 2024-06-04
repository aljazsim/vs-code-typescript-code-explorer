import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class FunctionDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(functionName: string, isExport: boolean, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = functionName;
        this.label = functionName;
        this.description = `(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})${(returnType ? `: ${returnType}` : "")}`;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.functionExported,
                dark: NodeImages.functionExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.function,
                dark: NodeImages.function
            };
        }
    }

    // #endregion Constructors (1)
}
