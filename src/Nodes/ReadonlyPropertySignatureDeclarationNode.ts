import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class ReadonlyPropertySignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(propertyName: string, propertyType: string | null, parent: DeclarationNode, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = propertyName;
        this.label = propertyName;
        this.description = propertyType ? `: ${propertyType}` : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
        this.command = command;

        this.iconPath = {
            light: NodeImages.propertyPublic,
            dark: NodeImages.propertyPublic
        };
    }

    // #endregion Constructors (1)
}
