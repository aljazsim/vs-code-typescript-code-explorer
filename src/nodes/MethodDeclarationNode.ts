import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";
import { Configuration } from "../configuration/Configuration";
import { NodeAccessModifier } from "../enums/NodeAccessModifier";
import { Node } from "./Node";

export class MethodDeclarationNode extends DeclarationNode
{
    constructor(name: string, parameters: Parameter[], returnType: string, public readonly accessModifier: NodeAccessModifier, public readonly isStatic: boolean, public readonly isAbstract: boolean, public readonly isAsync: boolean, parent: Node, command: vscode.Command, start: vscode.Position, end: vscode.Position, configuration: Configuration)
    {
        super(name, parent, [], command, start, end);

        this.label = name;
        this.description = configuration.showMemberTypes ? this.getDescription(parameters, returnType, configuration) : "";

        this.command = command;

        this.iconPath = {
            dark: this.getIconPath(configuration, isStatic, accessModifier, isAsync, isAbstract),
            light: this.getIconPath(configuration, isStatic, accessModifier, isAsync, isAbstract),
        };
    }

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

    private getIconPath(configuration: Configuration, isStatic: boolean, accessModifier: NodeAccessModifier, isAsync: boolean, isAbstract: boolean)
    {
        if (configuration.showStaticMemberIndicator && isStatic)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodPrivateStaticAsync : NodeImages.methodPrivateStatic;
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodProtectedStaticAsync : NodeImages.methodProtectedStatic;
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodPublicStaticAsync : NodeImages.methodPublicStatic;
            }
        }
        else if (isAbstract && configuration.showAbstractMemberIndicator)
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodProtectedAbstractAsync : NodeImages.methodProtectedAbstract;
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodPublicAbstractAsync : NodeImages.methodPublicAbstract;
            }
        }
        else
        {
            if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.private)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodPrivateAsync : NodeImages.methodPrivate
            }
            else if (configuration.showAccessorColorCoding && accessModifier === NodeAccessModifier.protected)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodProtectedAsync : NodeImages.methodProtected;
            }
            else if (!configuration.showAccessorColorCoding || accessModifier === NodeAccessModifier.public)
            {
                return configuration.showAsyncMethodIndicator && isAsync ? NodeImages.methodPublicAsync : NodeImages.methodPublic;
            }
        }
    }
}
