import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class IndexSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(indexParameters: Parameter[] | null, indexReturnType: string | null, public readonly isStatic: boolean, public readonly isReadOnly: boolean, parent: DeclarationNode, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = "index";
        this.label = "index";
        this.description = indexParameters && indexReturnType ? this.getDescription(indexParameters, indexReturnType) : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
        this.command = command;

        this.iconPath = {
            light: isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic,
            dark: isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getDescription(parameters: Parameter[], returnType: string | null): string | boolean
    {
        let description = "";

        description += "[";
        description += parameters.map(x => x.name + (x.type ? `: ${x.type}` : "")).join(", ");
        description += "]";
        description += ": ";
        description += returnType ? returnType : "void";

        return description;
    }

    // #endregion Private Methods (1)
}
