import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class PropertyDeclarationNode extends DeclarationNode
{
	constructor(propertyName: string, propertyType: string, public accessModifier: string, public isStatic: boolean, isConst: boolean, isReadOnly: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = propertyName;
		this.label = `${propertyName}: ${propertyType}`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		if (accessModifier == "public" ||
			accessModifier == "protected")
		{
			this.iconPath = {
				light: path.join(__filename, '..', '..', '..', 'resources', 'Property_16x.svg'),
				dark: path.join(__filename, '..', '..', '..', 'resources', 'Property_inverse_16x.svg')
			};
		}
		else
		{
			this.iconPath = {
				light: path.join(__filename, '..', '..', '..', 'resources', 'Field_16x.svg'),
				dark: path.join(__filename, '..', '..', '..', 'resources', 'Field_inverse_16x.svg')
			};
		}
	}
}