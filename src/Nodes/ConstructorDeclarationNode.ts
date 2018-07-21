import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";
import { Parameter } from "./Parameter";

export class ConstructorDeclarationNode extends DeclarationNode
{
	constructor(constructorName: string, parameters: Parameter[], parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = constructorName;
		this.label = `${constructorName} (${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(this.imageDir, "Constructor_light.svg"),
			dark: path.join(this.imageDir, "Constructor_dark.svg")
		};
	}
}