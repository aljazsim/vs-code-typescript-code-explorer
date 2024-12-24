import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { NodeAccessModifier } from "../enums/NodeAccessModifier";
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

        this.iconPath = {
            dark: this.getIconPath(configuration, accessModifier, isStatic),
            light: this.getIconPath(configuration, accessModifier, isStatic)
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getIconPath(configuration: Configuration, accessModifier: NodeAccessModifier, isStatic: boolean)
    {
        if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.private)
        {
            return isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyPrivateStatic : NodeImages.readonlyPropertyPrivate;
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
        {
            return isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyProtectedStatic : NodeImages.readonlyPropertyProtected;
        }
        else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.public)
        {
            return isStatic && configuration.showStaticMemberIndicator ? NodeImages.readonlyPropertyPublicStatic : NodeImages.readonlyPropertyPublic;
        }
    }

    // #endregion Private Methods (1)
}
