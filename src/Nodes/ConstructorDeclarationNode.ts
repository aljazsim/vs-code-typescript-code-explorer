import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class ConstructorDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(parameters: Parameter[] | null, parent: DeclarationNode, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = "constructor";
        this.label = this.name;
        this.description = parameters ? this.getDescription(parameters) : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
        this.command = command;

        this.iconPath = {
            light: NodeImages.constructorPublic,
            dark: NodeImages.constructorPublic
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getDescription(parameters: Parameter[]): string | boolean
    {
        let description = "";

        if (parameters.length > 0)
        {
            description += "(";
            description += parameters.map(x => x.name + (x.type ? `: ${x.type}` : "")).join(", ");
            description += ")";
        }

        return description;
    }

    // #endregion Private Methods (1)
}
