import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class IndexSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(indexType: string, public isStatic: boolean, isReadOnly: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = indexType;
        this.label = "index";
        this.description = indexType ? `: ${indexType}` : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: isStatic ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate,
            dark: isStatic ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate
        };
    }

    // #endregion Constructors (1)
}
