import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { Configuration } from "../configuration/configuration";
import { Node } from "./Node";

export class MethodSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, parameters: Parameter[], returnType: string, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);


        this.label = name;
        this.description = configuration.showMemberTypes ? this.getDescription(parameters, returnType, configuration) : "";

        this.command = command;

        this.iconPath = {
            light: NodeImages.methodPublic,
            dark: NodeImages.methodPublic
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getDescription(parameters: Parameter[], returnType: string, configuration: Configuration): string | boolean
    {
        let description = "";

        description += "(";
        description += parameters.map(x => x.name + (configuration.showMemberTypes ? `: ${x.type}` : "")).join(", ");
        description += ")";
        description += ": ";
        description += configuration.showMemberTypes ? returnType : "";

        return description;
    }

    // #endregion Private Methods (1)
}
