import * as vscode from "vscode";

export abstract class Node extends vscode.TreeItem
{
    public children: Node[] = [];
    public parent: Node | null = null;
}
