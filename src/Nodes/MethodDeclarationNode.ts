import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";
import { Parameter } from "./Parameter";

export class MethodDeclarationNode extends DeclarationNode
{
	constructor(methodName: string, accessModifier: string, isStatic: boolean, isAbstract: boolean, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = methodName;
		this.label = `${methodName}(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")})`;

		if (returnType)
		{
			this.label = `${this.label}: ${returnType}`;
		}

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', 'Method_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Method_inverse_16x.svg')
		};

		// // if (accessModifier == "public")
		// // {
		// // 	if (isStatic)
		// // 	{
		// // 		this.iconPath = "../../resources/public_static_method.svg";
		// // 	}
		// // 	else if (isAbstract)
		// // 	{
		// // 		this.iconPath = "../../resources/public_abstract_method.svg";
		// // 	}
		// // 	else
		// // 	{
		// // 		this.iconPath = "../../resources/public_method.svg";
		// // 	}
		// // }
		// // else if (accessModifier == "protected")
		// // {
		// // 	if (isStatic)
		// // 	{
		// // 		this.iconPath = "../../resources/protected_static_method.svg";
		// // 	}
		// // 	else if (isAbstract)
		// // 	{
		// // 		this.iconPath = "../../resources/protected_abstract_method.svg";
		// // 	}
		// // 	else
		// // 	{
		// // 		this.iconPath = "../../resources/protected_method.svg";
		// // 	}
		// // }
		// // else
		// // {
		// // 	if (isStatic)
		// // 	{
		// // 		this.iconPath = "../../resources/private_static_method.svg";
		// // 	}
		// // 	else
		// // 	{
		// // 		this.iconPath = "../../resources/private_method.svg";
		// // 	}
		// // }
	}
}