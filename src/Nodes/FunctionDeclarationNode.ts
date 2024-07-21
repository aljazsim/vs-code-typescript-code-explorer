import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { Configuration } from "../configuration/configuration";
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

        if (configuration.showAccessorColorCoding && isExport)
        {
            this.iconPath = {
                light:configuration.showAsyncMethodIndicator ? NodeImages.functionExportedAsync :  NodeImages.functionExported,
                dark:configuration.showAsyncMethodIndicator ? NodeImages.functionExportedAsync :  NodeImages.functionExported
            };
        }
        else if (configuration.showAccessorColorCoding && !isExport)
        {
            this.iconPath = {
                light:configuration.showAsyncMethodIndicator ? NodeImages.functionAsync :  NodeImages.function,
                dark:configuration.showAsyncMethodIndicator ? NodeImages.functionAsync :  NodeImages.function
            };
        }
        else
            {
                this.iconPath = {
                    light:configuration.showAsyncMethodIndicator ? NodeImages.methodPublicAsync :  NodeImages.methodPublic,
                    dark: configuration.showAsyncMethodIndicator ? NodeImages.methodPublicAsync :  NodeImages.methodPublic
                };
            }
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

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

    // #endregion Private Methods (1)
}
