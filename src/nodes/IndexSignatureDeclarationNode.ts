import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { NodeCaption } from "../enums/NodeCaption";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class IndexSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(parameters: Parameter[], type: string, public readonly isStatic: boolean, public readonly isReadOnly: boolean, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(NodeCaption.index, parent, [], command, start, end);

        this.label = NodeCaption.index;
        this.description = configuration.showMemberTypes ? this.getDescription(parameters, type, configuration) : "";

        this.command = command;

        this.iconPath = {
            light: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic,
            dark: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getDescription(parameters: Parameter[], returnType: string, configuration: Configuration): string | boolean
    {
        let description = "";

        description += "[";
        description += parameters.map(x => x.name + (configuration.showMemberTypes ? `: ${x.type}` : "")).join(", ");
        description += "]";
        description += ": ";
        description += configuration.showMemberTypes ? returnType : "";

        return description;
    }

    // #endregion Private Methods (1)
}
