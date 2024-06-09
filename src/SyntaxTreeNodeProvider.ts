import * as ts from "typescript";
import * as vscode from "vscode";

import { getAccessorDeclarationNode, getClassDeclarationNode, getConstructorDeclarationNode, getEnumDeclarationNode, getEnumMemberDeclarationNode, getFunctionDeclarationNode, getGetterDeclarationNode, getIndexSignatureDeclarationNode, getInterfaceDeclarationNode, getMethodDeclarationNode, getMethodSignatureDeclarationNode, getPropertyDeclarationNode, getPropertySignatureDeclarationNode, getSetterDeclarationNode, getStaticBlockDeclarationNode, getTypeAliasDeclarationNode, getVariableDeclarationNode } from "./helpers/node-helper";

import { Configuration } from "./configuration/configuration";
import { DeclarationNode } from "./Nodes/DeclarationNode";
import { EmptyDeclarationNode } from "./Nodes/EmptyDeclarationNode";
import { ProviderResult } from "vscode";
import { groupAndOrder } from "./helpers/node-group-helper";

export class SyntaxTreeNodeProvider implements vscode.TreeDataProvider<DeclarationNode>
{
    // #region Properties (4)

    private editor: vscode.TextEditor | null = null;
    private onDidChangeTreeDataEvent: vscode.EventEmitter<DeclarationNode | undefined> = new vscode.EventEmitter<DeclarationNode | undefined>();
    private rootElements: DeclarationNode[] = [new EmptyDeclarationNode()];

    public readonly onDidChangeTreeData: vscode.Event<DeclarationNode | undefined> = this.onDidChangeTreeDataEvent.event;

    // #endregion Properties (4)

    // #region Constructors (1)

    constructor(private readonly workspaceFolders: readonly vscode.WorkspaceFolder[])
    {
    }

    // #endregion Constructors (1)

    // #region Public Getters And Setters (1)

    public get rootElement(): DeclarationNode
    {
        return this.rootElements[0];
    }

    // #endregion Public Getters And Setters (1)

    // #region Public Methods (5)

    public getChildren(element?: DeclarationNode): Thenable<DeclarationNode[]>
    {
        let children: DeclarationNode[] = [];

        if (this.workspaceFolders &&
            this.workspaceFolders.length > 0 &&
            this.editor)
        {
            children = element ? element.children : this.rootElements;
        }

        return Promise.resolve(children);
    }

    public getNode(positionStart: vscode.Position, positionEnd: vscode.Position)
    {
        return this.findNode(this.rootElements, positionStart, positionEnd);
    }

    public getParent?(element: DeclarationNode): ProviderResult<DeclarationNode>
    {
        if (element)
        {
            return element.parent;
        }
        else
        {
            return null;
        }
    }

    public getTreeItem(element: DeclarationNode): vscode.TreeItem
    {
        return element;
    }

    public refresh(editor: vscode.TextEditor, configuration: Configuration): void
    {
        this.editor = editor;

        if (this.editor)
        {
            this.rootElements = this.analyzeSyntaxTree(this.editor, this.editor!.document.getText(), configuration);
        }
        else
        {
            this.rootElements = [new EmptyDeclarationNode()];
        }

        this.onDidChangeTreeDataEvent.fire(undefined);
    }

    // #endregion Public Methods (5)

    // #region Private Methods (3)

    private analyzeSyntaxTree(editor: vscode.TextEditor, sourceCode: string, configuration: Configuration)
    {
        const rootElements: DeclarationNode[] = [];
        const sourceFile = ts.createSourceFile("temp", sourceCode, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        // todo
        // const program = ts.createProgram(["temp"], { target: ts.ScriptTarget.Latest, source });

        // analyze ast
        for (let node of sourceFile.getChildren(sourceFile))
        {
            for (let rootElement of this.visitSyntaxTree(editor, node, sourceFile, null))
            {
                rootElements.push(rootElement);
            }
        }

        if (rootElements.length == 0)
        {
            // default item
            rootElements.push(new EmptyDeclarationNode());
        }

        // group and order
        return groupAndOrder(rootElements, configuration.groupingAndOrder, configuration.showMemberCount);
    }

    private findNode(nodes: DeclarationNode[], positionStart: vscode.Position, positionEnd: vscode.Position): DeclarationNode | null
    {
        let result: DeclarationNode | null;

        // try to find a match among the child nodes
        for (let node of nodes)
        {
            result = this.findNode(node.children, positionStart, positionEnd);

            if (result)
            {
                return result;
            }
        }

        // try to find a match among the nodes
        for (let node of nodes)
        {
            if (node.start.isBeforeOrEqual(positionStart) &&
                node.end.isAfterOrEqual(positionEnd))
            {
                return node;
            }
        }

        return null;
    }

    private visitSyntaxTree(editor: vscode.TextEditor, node: ts.Node, sourceFile: ts.SourceFile, parentElement: DeclarationNode | null): DeclarationNode[]
    {
        let nodes: DeclarationNode[] = [];
        let childElements: DeclarationNode[] = [];

        // enum elements
        if (ts.isEnumDeclaration(node))
        {
            nodes.push(getEnumDeclarationNode(editor, sourceFile, node, parentElement, childElements));
        }
        else if (ts.isEnumMember(node))
        {
            nodes.push(getEnumMemberDeclarationNode(editor, sourceFile, node, parentElement, []));
        }

        // interface / type alias elements
        if (ts.isInterfaceDeclaration(node))
        {
            nodes.push(getInterfaceDeclarationNode(editor, sourceFile, node, parentElement, childElements));
        }
        else if (ts.isTypeAliasDeclaration(node))
        {
            nodes.push(getTypeAliasDeclarationNode(editor, sourceFile, node, parentElement, childElements));
        }
        else if (ts.isPropertySignature(node))
        {
            nodes.push(getPropertySignatureDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isIndexSignatureDeclaration(node))
        {
            nodes.push(getIndexSignatureDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isMethodSignature(node))
        {
            nodes.push(getMethodSignatureDeclarationNode(editor, sourceFile, node, parentElement, []));
        }

        // class elements
        if (ts.isClassDeclaration(node))
        {
            nodes.push(getClassDeclarationNode(editor, sourceFile, node, parentElement, childElements));
        }
        else if (ts.isConstructorDeclaration(node))
        {
            getConstructorDeclarationNode(editor, sourceFile, node, parentElement, []).forEach(n => nodes.push(n));
        }
        else if (ts.isClassStaticBlockDeclaration(node))
        {
            nodes.push(getStaticBlockDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isAutoAccessorPropertyDeclaration(node))
        {
            nodes.push(getAccessorDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isPropertyDeclaration(node))
        {
            nodes.push(getPropertyDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isGetAccessor(node))
        {
            nodes.push(getGetterDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isSetAccessor(node))
        {
            nodes.push(getSetterDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isMethodDeclaration(node))
        {
            nodes.push(getMethodDeclarationNode(editor, sourceFile, node, parentElement, []));
        }

        // module elements
        if (ts.isFunctionDeclaration(node))
        {
            nodes.push(getFunctionDeclarationNode(editor, sourceFile, node, parentElement, []));
        }
        else if (ts.isVariableStatement(node))
        {
            getVariableDeclarationNode(editor, sourceFile, node, parentElement, []).forEach(n => nodes.push(n));
        }

        // get child elements
        for (const childNode of node.getChildren(sourceFile))
        {
            for (const childElement of this.visitSyntaxTree(editor, childNode, sourceFile, nodes.length > 0 ? nodes[0] : parentElement))
            {
                childElements.push(childElement);
            }
        }

        if (nodes.length == 0)
        {
            nodes = childElements;
        }

        // expand/collapse node
        nodes.forEach(n => n.collapsibleState = n.children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);

        return nodes;
    }

    // #endregion Private Methods (3)
}
