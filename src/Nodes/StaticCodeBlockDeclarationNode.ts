import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { NodeCaption } from "../enums/node-caption";
import { Node } from "./Node";

export class StaticCodeBlockDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super(NodeCaption.staticConstructor, parent, [], command, start, end);

        this.label = this.name;

        this.command = command;

        this.iconPath = {
            light: NodeImages.constructorPublicStatic,
            dark: NodeImages.constructorPublicStatic
        };
    }

    // #endregion Constructors (1)
}
