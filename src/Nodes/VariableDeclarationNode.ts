import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class VariableDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(variableName: string, variableType: string, public readonly isExport: boolean, public readonly isConst: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = variableName;
        this.label = variableName;
        this.description = variableType ? `: ${variableType}` : "";



        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        if (isConst)
        {
            // TODO
        }

        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.variableExported,
                dark: NodeImages.variableExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.variable,
                dark: NodeImages.variable
            };
        }
    }

    // #endregion Constructors (1)
}
