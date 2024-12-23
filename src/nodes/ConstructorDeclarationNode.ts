import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { NodeCaption } from "../enums/NodeCaption";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class ConstructorDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(parameters: Parameter[], parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(NodeCaption.constructor, parent, [], command, start, end);

        this.label = this.name;
        this.description = parameters ? this.getDescription(parameters, configuration) : "";

        this.command = command;

        this.iconPath = {
            light: NodeImages.constructorPublic,
            dark: NodeImages.constructorPublic
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getDescription(parameters: Parameter[], configuration: Configuration): string | boolean
    {
        let description = "";

        if (parameters.length > 0)
        {
            description += "(";
            description += parameters.map(x => x.name + (configuration.showMemberTypes ? `: ${x.type}` : "")).join(", ");
            description += ")";
        }

        return description;
    }

    // #endregion Private Methods (1)
}
