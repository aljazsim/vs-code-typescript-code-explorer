import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/configuration";
import { NodeAccessModifier } from "../enums/node-access-modifier";
import { Node } from "./Node";

export class SetterDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, type: string, public readonly accessModifier: NodeAccessModifier, public readonly isStatic: boolean, public readonly isAbstract: boolean, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? `(value: ${type})` : "";

        this.command = command;

        if (configuration.showStaticMemberIndicator && isStatic)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                this.iconPath = {
                    light: NodeImages.propertyPrivateStatic,
                    dark: NodeImages.propertyPrivateStatic
                };
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                this.iconPath = {
                    light: NodeImages.propertyProtectedStatic,
                    dark: NodeImages.propertyProtectedStatic
                };
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                this.iconPath = {
                    light: NodeImages.propertyPublicStatic,
                    dark: NodeImages.propertyPublicStatic
                };
            }
        }
        else if (isAbstract && configuration.showAbstractMemberIndicator)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                this.iconPath = {
                    light: NodeImages.propertyProtectedAbstract,
                    dark: NodeImages.propertyProtectedAbstract
                };
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                this.iconPath = {
                    light: NodeImages.propertyPublicAbstract,
                    dark: NodeImages.propertyPublicAbstract
                };
            }
        }
        else
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                this.iconPath = {
                    light: NodeImages.propertyPrivate,
                    dark: NodeImages.propertyPrivate
                };
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                this.iconPath = {
                    light: NodeImages.propertyProtected,
                    dark: NodeImages.propertyProtected
                };
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                this.iconPath = {
                    light: NodeImages.propertyPublic,
                    dark: NodeImages.propertyPublic
                };
            }
        }
    }

    // #endregion Constructors (1)
}
