import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { NodeAccessModifier } from "../enums/NodeAccessModifier";
import { Node } from "./Node";

export class PropertyDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, type: string, public readonly accessModifier: NodeAccessModifier, public readonly isStatic: boolean, public readonly isAbstract: boolean, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? `: ${type}` : "";

        this.command = command;

        if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.private)
        {
            this.iconPath = {
                light: isStatic && configuration.showStaticMemberIndicator ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate,
                dark: isStatic && configuration.showStaticMemberIndicator ? NodeImages.propertyPrivateStatic : NodeImages.propertyPrivate
            };
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
        {
            this.iconPath = {
                light: isStatic && configuration.showStaticMemberIndicator ? NodeImages.propertyProtectedStatic : NodeImages.propertyProtected,
                dark: isStatic && configuration.showStaticMemberIndicator ? NodeImages.propertyProtectedStatic : NodeImages.propertyProtected
            };
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.public)
        {
            this.iconPath = {
                light: isStatic && configuration.showStaticMemberIndicator ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic,
                dark: isStatic && configuration.showStaticMemberIndicator ? NodeImages.propertyPublicStatic : NodeImages.propertyPublic
            };
        }
    }

    // #endregion Constructors (1)
}
