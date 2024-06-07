import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class IndexSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(indexParameters: Parameter[], indexReturnType: string, public readonly isStatic: boolean, public readonly isReadOnly: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = "index";
        this.label = "index";
        this.description = `[${indexParameters.map(ip => `${ip.name}: ${ip.type}`).join(", ")}]: ${indexReturnType}`;

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;

        this.iconPath = {
            light: isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic,
            dark: isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic
        };
    }

    // #endregion Constructors (1)
}
