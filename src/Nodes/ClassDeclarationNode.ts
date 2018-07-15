import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";

export class ClassDeclarationNode extends DeclarationNode
{

	constructor(className: string, isExport: boolean, isAbstract: boolean, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = className;
		this.label = className;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', 'Class_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Class_inverse_16x.svg')
		};

		// // if (isExport)
		// // {
		// // 	if (isAbstract)
		// // 	{
		// // 		this.iconPath = "../../resources/abstract_public_class.svg";
		// // 	}
		// // 	else
		// // 	{
		// // 		this.iconPath = "../../resources/public_class.svg";
		// // 	}
		// // }
		// // else
		// // {
		// // 	if (isAbstract)
		// // 	{
		// // 		this.iconPath = "../../resources/abstract_private_class.svg";
		// // 	}
		// // 	else
		// // 	{
		// // 		this.iconPath = "../../resources/private_class.svg";
		// // 	}
		// // }
	}
}