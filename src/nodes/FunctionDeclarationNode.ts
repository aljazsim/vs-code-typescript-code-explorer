import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { Configuration } from "../configuration/Configuration";
import { Node } from "./Node";

export class FunctionDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, public readonly isExport: boolean, public readonly isAsync: boolean, parameters: Parameter[], returnType: string, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? (parameters && returnType ? this.getDescription(parameters, returnType, configuration) : "") : "";

        this.command = command;

        this.iconPath = {
            dark: this.getIconPath(configuration, isExport, isAsync),
            light: this.getIconPath(configuration, isExport, isAsync)
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (2)

    private getDescription(parameters: Parameter[], returnType: string | null, configuration: Configuration): string | boolean
    {
        let description = "";

        description += "(";
        description += parameters.map(x => x.name + (configuration.showMemberTypes ? `: ${x.type}` : "")).join(", ");
        description += ")";
        description += ": ";
        description += configuration.showMemberTypes ? returnType : "void";

        return description;
    }

    private getIconPath(configuration: Configuration, isExport: boolean, isAsync: boolean)
    {
        if (configuration.showAccessorColorCoding && isExport)
        {
            return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.functionExportedAsync : NodeImages.functionExported;
        }
        else if (configuration.showAccessorColorCoding && !isExport)
        {
            return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.functionAsync : NodeImages.function;
        }
        else
        {
            return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodPublicAsync : NodeImages.methodPublic;
        }
    }

    // #endregion Private Methods (2)
}
