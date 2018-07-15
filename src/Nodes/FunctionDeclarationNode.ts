import * as path from "path";
import * as vscode from "vscode";
import { DeclarationNode } from "./DeclarationNode";
import { Parameter } from "./Parameter";

export class FunctionDeclarationNode extends DeclarationNode
{
	constructor(functionName: string, isExport: boolean, parameters: Parameter[], returnType: string | null, parent: DeclarationNode | null, children: DeclarationNode[], command: vscode.Command, start: vscode.Position, end: vscode.Position)
	{
		super();

		this.name = functionName;
		this.label = `${functionName}(${parameters.map(x => `${x.name}: ${x.type}`).join(", ")}): ${returnType}`;

		this.start = start;
		this.end = end;

		this.parent = parent;
		this.children = children;
		this.command = command;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', 'Function_16x.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'Function_inverse_16x.svg')
		};
	}
}