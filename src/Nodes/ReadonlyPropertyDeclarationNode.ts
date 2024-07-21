import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/configuration";
import { NodeAccessModifier } from "../enums/node-access-modifier";
import { Node } from "./Node";

export class ReadonlyPropertyDeclarationNode extends DeclarationNode
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
                light: isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyPrivateStatic : NodeImages.readonlyPropertyPrivate,
                dark: isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyPrivateStatic : NodeImages.readonlyPropertyPrivate
            };
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
        {
            this.iconPath = {
                light: isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyProtectedStatic : NodeImages.readonlyPropertyProtected,
                dark: isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyProtectedStatic : NodeImages.readonlyPropertyProtected
            };
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.public)
        {
            this.iconPath = {
                light: isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyPublicStatic : NodeImages.readonlyPropertyPublic,
                dark: isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyPublicStatic : NodeImages.readonlyPropertyPublic
            };
        }
    }

    // #endregion Constructors (1)
}
