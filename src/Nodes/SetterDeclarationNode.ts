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

        if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.private)
        {
            this.iconPath = {
                light: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate,
                dark: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate
            };
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
        {
            this.iconPath = {
                light: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyProtectedStatic : NodeImages.propertyProtected,
                dark: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyProtectedStatic : NodeImages.propertyProtected
            };
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.public)
        {
            this.iconPath = {
                light: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic,
                dark: configuration.showStaticMemberIndicator && isStatic ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic
            };
        }
    }

    // #endregion Constructors (1)
}
