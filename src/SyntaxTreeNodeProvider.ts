import * as ts from "typescript";
import * as vscode from "vscode";

import { getAccessorDeclarationNode, getClassDeclarationNode, getConstructorDeclarationNode, getEnumDeclarationNode, getEnumMemberDeclarationNode, getFunctionDeclarationNode, getGetterDeclarationNode, getIndexSignatureDeclarationNode, getInterfaceDeclarationNode, getMethodDeclarationNode, getMethodSignatureDeclarationNode, getPropertyDeclarationNode, getPropertySignatureDeclarationNode, getSetterDeclarationNode, getStaticBlockDeclarationNode, getTypeAliasDeclarationNode, getVariableDeclarationNode } from "./helpers/NodeHelper";

import { Configuration } from "./configuration/Configuration";
import { EmptyNode } from "./nodes/EmptyNode";
import { ProviderResult } from "vscode";
import { groupAndOrder } from "./helpers/NodeOrganizeHelper";
import { Node } from "./nodes/Node";
import { DeclarationNode } from "./nodes/DeclarationNode";

export class SyntaxTreeNodeProvider implements vscode.TreeDataProvider<Node>
{
    // #region Properties (4)

    private editor: vscode.TextEditor | null = null;
    private onDidChangeTreeDataEvent: vscode.EventEmitter<Node | undefined> = new vscode.EventEmitter<Node | undefined>();
    private rootElements: Node[] = [new EmptyNode()];

    public readonly onDidChangeTreeData: vscode.Event<Node | undefined> = this.onDidChangeTreeDataEvent.event;

    // #endregion Properties (4)

    // #region Constructors (1)

    constructor(private readonly workspaceFolders: readonly vscode.WorkspaceFolder[])
    {
    }

    // #endregion Constructors (1)

    // #region Public Getters And Setters (1)

    public get rootElement(): Node
    {
        return this.rootElements[0];
    }

    // #endregion Public Getters And Setters (1)

    // #region Public Methods (5)

    public getChildren(element?: Node): Thenable<Node[]>
    {
        let children: Node[] = [];

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

    public getParent?(element: Node): ProviderResult<Node>
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

    public getTreeItem(element: Node): vscode.TreeItem
    {
        return element;
    }

    public refresh(editor: vscode.TextEditor, configuration: Configuration): void
    {
        this.editor = editor;

        if (this.editor)
        {
            try
            {
                this.rootElements = this.analyzeSyntaxTree(this.editor, this.editor!.document.getText(), configuration);
            }
            catch (error)
            {
                this.rootElements = [];

                console.log(error);
                console.trace();
            }
        }
        else
        {
            this.rootElements = [new EmptyNode()];
        }

        this.onDidChangeTreeDataEvent.fire(undefined);
    }

    // #endregion Public Methods (5)

    // #region Private Methods (3)

    private analyzeSyntaxTree(editor: vscode.TextEditor, sourceCode: string, configuration: Configuration)
    {
        const rootElements: Node[] = [];
        const sourceFile = ts.createSourceFile("temp", sourceCode, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        // todo
        // const program = ts.createProgram(["temp"], { target: ts.ScriptTarget.Latest, source });

        // analyze ast
        for (let node of sourceFile.getChildren(sourceFile))
        {
            for (let rootElement of this.visitSyntaxTree(editor, node, sourceFile, null, configuration))
            {
                rootElements.push(rootElement);
            }
        }

        if (rootElements.length == 0)
        {
            // default item
            rootElements.push(new EmptyNode());
        }

        // group and order
        return groupAndOrder(rootElements, configuration.groupingAndOrder, configuration.showMemberCount);
    }

    private findNode(nodes: Node[], positionStart: vscode.Position, positionEnd: vscode.Position): Node | null
    {
        let result: Node | null;

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
            if (node instanceof DeclarationNode &&
                node.start.isBeforeOrEqual(positionStart) &&
                node.end.isAfterOrEqual(positionEnd))
            {
                return node;
            }
        }

        return null;
    }

    private visitSyntaxTree(editor: vscode.TextEditor, node: ts.Node, sourceFile: ts.SourceFile, parentElement: Node | null, configuration: Configuration): Node[]
    {
        let nodes: Node[] = [];
        let childElements: Node[] = [];

        // enum elements
        if (ts.isEnumDeclaration(node))
        {
            nodes.push(getEnumDeclarationNode(editor, sourceFile, node, parentElement, childElements, configuration));
        }
        else if (ts.isEnumMember(node))
        {
            nodes.push(getEnumMemberDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }

        // interface / type alias elements
        if (ts.isInterfaceDeclaration(node))
        {
            nodes.push(getInterfaceDeclarationNode(editor, sourceFile, node, parentElement, childElements, configuration));
        }
        else if (ts.isTypeAliasDeclaration(node))
        {
            nodes.push(getTypeAliasDeclarationNode(editor, sourceFile, node, parentElement, childElements, configuration));
        }
        else if (ts.isPropertySignature(node))
        {
            nodes.push(getPropertySignatureDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isIndexSignatureDeclaration(node))
        {
            nodes.push(getIndexSignatureDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isMethodSignature(node))
        {
            nodes.push(getMethodSignatureDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }

        // class elements
        if (ts.isClassDeclaration(node))
        {
            nodes.push(getClassDeclarationNode(editor, sourceFile, node, parentElement, childElements, configuration));
        }
        else if (ts.isConstructorDeclaration(node))
        {
            getConstructorDeclarationNode(editor, sourceFile, node, parentElement!, configuration).forEach(n => nodes.push(n), configuration);
        }
        else if (ts.isClassStaticBlockDeclaration(node))
        {
            nodes.push(getStaticBlockDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isAutoAccessorPropertyDeclaration(node))
        {
            nodes.push(getAccessorDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isPropertyDeclaration(node))
        {
            nodes.push(getPropertyDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isGetAccessor(node))
        {
            nodes.push(getGetterDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isSetAccessor(node))
        {
            nodes.push(getSetterDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isMethodDeclaration(node))
        {
            nodes.push(getMethodDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }

        // module elements
        if (ts.isFunctionDeclaration(node))
        {
            nodes.push(getFunctionDeclarationNode(editor, sourceFile, node, parentElement!, configuration));
        }
        else if (ts.isVariableStatement(node))
        {
            getVariableDeclarationNode(editor, sourceFile, node, parentElement!, configuration).forEach(n => nodes.push(n));
        }

        // get child elements
        for (const childNode of node.getChildren(sourceFile))
        {
            for (const childElement of this.visitSyntaxTree(editor, childNode, sourceFile, nodes.length > 0 ? nodes[0] : parentElement, configuration))
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
