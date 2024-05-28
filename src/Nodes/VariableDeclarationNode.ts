import * as path from "path";
import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class VariableDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(variableName: string, variableType: string, public isExport: boolean, public readonly isConst: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = variableName;
        this.label = `${variableName}: ${variableType}`;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: path.join(this.imageDir, "Constant_light.svg"),
            dark: path.join(this.imageDir, "Constant_dark.svg")
        };

        if (isExport)
        {
            this.label += " " + this.protectedImage;
        }
    }

    // #endregion Constructors (1)
}
