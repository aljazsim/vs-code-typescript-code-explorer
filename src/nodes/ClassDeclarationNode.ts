import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class ClassDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, public readonly isExport: boolean, public readonly isAbstract: boolean, parent: Node | null, children: Node[], command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, children, command, start, end);

        this.label = name;
        this.description = isAbstract ? "abstract" : "";

        this.iconPath = {
            dark: this.getIconPath(configuration, isExport),
            light: this.getIconPath(configuration, isExport)
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getIconPath(configuration: Configuration, isExport: boolean)
    {
        if (!configuration.showAccessorColorCoding || isExport)
        {
            return NodeImages.classExported;
        }
        else if (!isExport)
        {
            return NodeImages.class;
        }
    }

    // #endregion Private Methods (1)
}
