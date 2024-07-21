import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/configuration";
import { Node } from "./Node";

export class ClassDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, public readonly isExport: boolean, public readonly isAbstract: boolean, parent: Node | null, children: Node[], command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, children, command, start, end);

        this.label = name;
        this.description = isAbstract ? "abstract" : "";

        if (!configuration.showAccessorColorCoding || isExport)
        {
            this.iconPath = {
                light: NodeImages.classExported,
                dark: NodeImages.classExported
            };
        }
        else if (!isExport)
        {
            this.iconPath = {
                light: NodeImages.class,
                dark: NodeImages.class
            };
        }
    }

    // #endregion Constructors (1)
}
