import * as vscode from "vscode";

import { DeclarationNode } from "./DeclarationNode";
import { NodeImages } from "./NodeImages";
import { Parameter } from "./Parameter";

export class MethodSignatureDeclarationNode extends DeclarationNode
{
    // #region Constructors (1)

    constructor(methodName: string, parameters: Parameter[] | null, returnType: string | null, parent: DeclarationNode, command: vscode.Command, start: vscode.Position, end: vscode.Position)
    {
        super();

        this.name = methodName;
        this.label = methodName;
        this.description = parameters && returnType ? this.getDescription(parameters, returnType) : "";

        this.start = start;
        this.end = end;

        this.parent = parent;
        this.children = [];
        this.command = command;

        this.iconPath = {
            light: NodeImages.methodPublic,
            dark: NodeImages.methodPublic
        };
    }

    // #endregion Constructors (1)

    // #region Private Methods (1)

    private getDescription(parameters: Parameter[], returnType: string | null): string | boolean
    {
        let description = "";

        description += "(";
        description += parameters.map(x => x.name + (x.type ? `: ${x.type}` : "")).join(", ");
        description += ")";
        description += ": ";
        description += returnType ? returnType : "void";

        return description;
    }

    // #endregion Private Methods (1)
}
