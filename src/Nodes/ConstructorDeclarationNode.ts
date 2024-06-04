import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class ConstructorDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(parameters: Parameter[], parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = "constructor";
        this.label = this.name;
        this.description = parameters.length > 0 ? `(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})` : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: NodeImages.constructorPublic,
            dark: NodeImages.constructorPublic
        };

    }

    // #endregion Constructors (1)
}
