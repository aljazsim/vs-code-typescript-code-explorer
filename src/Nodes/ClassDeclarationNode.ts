import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";

export class ClassDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(className: string, public readonly isExport: boolean, public readonly isAbstract: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = className;
        this.label = className;
        this.description = isAbstract ? "abstract" : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = children;
        this.command = command;


        if (isExport)
        {
            this.iconPath = {
                light: NodeImages.classExported,
                dark: NodeImages.classExported
            };
        }
        else
        {
            this.iconPath = {
                light: NodeImages.class,
                dark: NodeImages.class
            };
        }
    }

    // #endregion Constructors (1)
}
