import * as vscode from "vscode";

import { Configuration } from "./configuration/Configuration";
import { SyntaxTreeNodeProvider } from "./SyntaxTreeNodeProvider";

export function activate(context: vscode.ExtensionContext)
{
    let selecting: boolean = false;

    // register the tree provider with the view
    const nodeTreeProvider = new SyntaxTreeNodeProvider(vscode.workspace.workspaceFolders ?? []);
    const view = vscode.window.createTreeView('tsce.codeExplorer', { treeDataProvider: nodeTreeProvider });

    // detect when configuration changes
    vscode.workspace.onDidChangeConfiguration(e => configuration = Configuration.getConfiguration());

    vscode.workspace.onDidChangeTextDocument(_ =>
    {
        // editor contents changed -> refresh view with the current window
        nodeTreeProvider.refresh(vscode.window.activeTextEditor!, configuration);
    });

    vscode.workspace.onDidOpenTextDocument(_ =>
    {
        // editor opened -> refresh view with the current window
        nodeTreeProvider.refresh(vscode.window.activeTextEditor!, configuration);
    });

    vscode.workspace.onDidCloseTextDocument(_ =>
    {
        // editor closed -> refresh view with the current window
        nodeTreeProvider.refresh(vscode.window.activeTextEditor!, configuration);
    });

    vscode.window.onDidChangeActiveTextEditor(editor =>
    {
        // switched editors -> refresh view with the current window
        nodeTreeProvider.refresh(editor!, configuration);
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
                let currentNode = nodeTreeProvider.getNode(e.selections[0].start, e.selections[e.selections.length - 1].end);

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

        vscode.window.showTextDocument(editor.document);

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
            view.reveal(nodeTreeProvider.rootElement, { select: true, focus: true });
        }
    }));

    if (vscode.window.activeTextEditor)
    {
        nodeTreeProvider.refresh(vscode.window.activeTextEditor, configuration);
    }
}

let configuration = Configuration.getConfiguration();
