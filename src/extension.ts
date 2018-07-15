import * as vscode from "vscode";
import { DeclarationNode } from "./Nodes/DeclarationNode";
import { SyntaxTreeNodeProvider } from "./SyntaxTreeNodeProvider";

'use strict';

export function activate(context: vscode.ExtensionContext)
{
	let view: vscode.TreeView<DeclarationNode>;
	let nodeDependenciesProvider: SyntaxTreeNodeProvider;
	let selecting: boolean = false;

	nodeDependenciesProvider = new SyntaxTreeNodeProvider(vscode.workspace.rootPath!);

	if (vscode.window.activeTextEditor)
	{
		nodeDependenciesProvider.refresh(vscode.window.activeTextEditor);
	}

	// register the tree provider with the view
	view = vscode.window.createTreeView('tsce.codeExplorer', { treeDataProvider: nodeDependenciesProvider });

	vscode.workspace.onDidChangeTextDocument(e =>
	{
		// editor contents changed -> refresh view with the current window
		nodeDependenciesProvider.refresh(vscode.window.activeTextEditor!);
	});
	vscode.workspace.onDidOpenTextDocument(textDocument =>
	{
		// editor opened -> refresh view with the current window
		nodeDependenciesProvider.refresh(vscode.window.activeTextEditor!);
	});
	vscode.workspace.onDidCloseTextDocument(textDocument =>
	{
		// editor closed -> refresh view with the current window
		nodeDependenciesProvider.refresh(vscode.window.activeTextEditor!);
	});

	vscode.window.onDidChangeActiveTextEditor(editor =>
	{
		// switched editors -> refresh view with the current window
		nodeDependenciesProvider.refresh(editor!);
	});
	vscode.window.onDidChangeTextEditorSelection(e =>
	{
		if (!selecting)
		{
			// cursor position changed -> try to find a node that corresponds to the position and select it in the view
			if (e.textEditor &&
				e.selections &&
				e.selections.length > 0)
			{
				let currentNode = nodeDependenciesProvider.getNode(e.selections[0].start, e.selections[e.selections.length - 1].end);

				if (currentNode)
				{
					if (view.visible)
					{
						view.reveal(currentNode, { select: true, focus: false });
					}
				}
			}
		}
	});

	vscode.commands.registerCommand('tsce.goto', (editor: vscode.TextEditor, position: vscode.Position) =>
	{
		selecting = true;

		// node clicked -> move cursor to the element
		editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.AtTop);
		editor.selection = new vscode.Selection(position, position);
		editor.show();

		selecting = false;
	});

	context.subscriptions.push(vscode.commands.registerCommand('tsce.showCodeExplorer', () =>
	{
		// show code explorer requested -> show view
		if (view.selection &&
			view.selection.length > 0)
		{
			view.reveal(view.selection[0], { select: true, focus: true });
		}
		else
		{
			view.reveal(nodeDependenciesProvider.rootElement, { select: true, focus: true });
		}
	}));
}
