import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class ConstVariableDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(variableName: string, variableType: string | null, public readonly isExport: boolean, public readonly isConst: boolean, parent: DeclarationNode | null, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = variableName;
        this.label = variableName;
        this.description = variableType ? `: ${variableType}` : "";



        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
        this.command = command;

        if (isConst)
        {
            // TODO
        }

        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.constVariableExported,
                dark: NodeImages.constVariableExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.constVariable,
                dark: NodeImages.constVariable
            };
        }
    }

    // #endregion Constructors (1)
}
