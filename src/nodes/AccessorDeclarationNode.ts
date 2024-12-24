import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Configuration } from "../configuration/Configuration";
import { NodeAccessModifier } from "../enums/NodeAccessModifier";
import { Node } from "./Node";

export class AccessorDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(name: string, type: string, public accessModifier: NodeAccessModifier, public isStatic: boolean, public isAbstract: boolean, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;

        if (configuration.showMemberTypes)
        {
            this.description = `: ${type}`;
        }

        this.iconPath = {
            dark: this.getIconPath(configuration, accessModifier, isStatic, isAbstract),
            light: this.getIconPath(configuration, accessModifier, isStatic, isAbstract)
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getIconPath(configuration: Configuration, accessModifier: NodeAccessModifier, isStatic: boolean, isAbstract: boolean)
    {
        if (configuration.showStaticMemberIndicator && isStatic)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                return NodeImages.propertyPrivateStatic;
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                return NodeImages.propertyProtectedStatic;
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                return NodeImages.propertyPublicStatic
            }
        }
        else if (isAbstract && configuration.showAbstractMemberIndicator)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                return NodeImages.propertyProtectedAbstract;
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                return NodeImages.propertyPublicAbstract;
            }
        }

        else
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                return NodeImages.propertyPrivate;
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                return NodeImages.propertyProtected;
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                return NodeImages.propertyPublic;
            }
        }
    }

    // #endregion Private Methods (1)
}
