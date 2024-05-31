import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

export class VariableDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(variableName: string, variableType: string, public isExport: boolean, public readonly isConst: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = variableName;
        this.label = variableName;
        this.description = variableType ? `: ${variableType}` : "";

        if (isConst)
        {
            this.description += " " + this.readOnlyCharacter;
        }

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: this.variableItemLightIconFilePath,
            dark: this.variableItemDarkIconFilePath
        };
    }

    // #endregion Constructors (1)
}
