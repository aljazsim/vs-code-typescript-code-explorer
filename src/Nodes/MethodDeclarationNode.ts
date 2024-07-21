import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { Configuration } from "../configuration/configuration";
import { NodeAccessModifier } from "../enums/node-access-modifier";
import { Node } from "./Node";

export class MethodDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, parameters: Parameter[], returnType: string, public readonly accessModifier: NodeAccessModifier, public readonly isStatic: boolean, public readonly isAbstract: boolean, public readonly isAsync: boolean, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? this.getDescription(parameters, returnType, configuration) : "";

        this.command = command;

        if (configuration.showStaticMemberIndicator && isStatic)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                this.iconPath = {
                    light: NodeImages.methodPrivateStatic,
                    dark: NodeImages.methodPrivateStatic
                };
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                this.iconPath = {
                    light: NodeImages.methodProtectedStatic,
                    dark: NodeImages.methodProtectedStatic
                };
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                this.iconPath = {
                    light: NodeImages.methodPublicStatic,
                    dark: NodeImages.methodPublicStatic
                };
            }
        }
        else if (isAbstract && configuration.showAbstractMemberIndicator)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                this.iconPath = {
                    light: NodeImages.methodProtectedAbstract,
                    dark: NodeImages.methodProtectedAbstract
                };
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                this.iconPath = {
                    light: NodeImages.methodPublicAbstract,
                    dark: NodeImages.methodPublicAbstract
                };
            }
        }
        else
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                this.iconPath = {
                    light: NodeImages.methodPrivate,
                    dark: NodeImages.methodPrivate
                };
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                this.iconPath = {
                    light: NodeImages.methodProtected,
                    dark: NodeImages.methodProtected
                };
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                this.iconPath = {
                    light: NodeImages.methodPublic,
                    dark: NodeImages.methodPublic
                };
            }
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
        description += configuration.showMemberTypes ? returnType : "";

        return description;
    }

    // #endregion Private Methods (1)
}
