import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";

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
            light: this.propertyLightIconFilePath,
            dark: this.propertyDarkIconFilePath
        };
    }

    // #endregion Constructors (1)
}
