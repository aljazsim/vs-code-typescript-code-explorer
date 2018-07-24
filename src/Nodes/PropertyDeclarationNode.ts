import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class PropertyDeclarationNode extends DeclarationNode
{
	// #region Constructors (1)

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

		if (isConst ||
			isReadOnly)
		{
			this.iconPath = {
				light: path.join(this.imageDir, "Constant_light.svg"),
				dark: path.join(this.imageDir, "Constant_dark.svg")
			};

			if (accessModifier == "protected")
			{
				this.label += " " + this.protectedImage;
			}

			if (accessModifier == "private")
			{
				this.label += " " + this.privateImage;
			}
		}
		else if (accessModifier == "public" ||
			accessModifier == "protected")
		{
			this.iconPath = {
				light: path.join(this.imageDir, "Property_light.svg"),
				dark: path.join(this.imageDir, "Property_dark.svg")
			};

			if (accessModifier == "protected")
			{
				this.label += " " + this.protectedImage;
			}
		}
		else
		{
			this.iconPath = {
				light: path.join(this.imageDir, "Field_light.svg"),
				dark: path.join(this.imageDir, "Field_dark.svg")
			};
		}
	}

	// #endregion
}