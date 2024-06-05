import { AccessorDeclarationNode } from "../Nodes/AccessorDeclarationNode";
import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { ConstDeclarationNode } from "../Nodes/ConstDeclarationNode";
import { ConstructorDeclarationNode } from "../Nodes/ConstructorDeclarationNode";
import { DeclarationNode } from "../Nodes/DeclarationNode";
import { DescriptionNode } from "../Nodes/DescriptionNode";
import { EmptyDeclarationNode } from "../Nodes/EmptyDeclarationNode";
import { EnumDeclarationNode } from "../Nodes/EnumDeclarationNode";
import { EnumMemberDeclarationNode } from "../Nodes/EnumMemberDeclarationNode";
import { FunctionDeclarationNode } from "../Nodes/FunctionDeclarationNode";
import { GetterDeclarationNode } from "../Nodes/GetterDeclarationNode";
import { IndexSignatureDeclarationNode } from "../Nodes/IndexSignatureDeclarationNode";
import { InterfaceDeclarationNode } from "../Nodes/InterfaceDeclarationNode";
import { MethodDeclarationNode } from "../Nodes/MethodDeclarationNode";
import { MethodSignatureDeclarationNode } from "../Nodes/MethodSignatureDeclarationNode";
import { PropertyDeclarationNode } from "../Nodes/PropertyDeclarationNode";
import { PropertySignatureDeclarationNode } from "../Nodes/PropertySignatureDeclarationNode";
import { SetterDeclarationNode } from "../Nodes/SetterDeclarationNode";
import { StaticCodeBlockDeclarationNode } from "../Nodes/StaticCodeBlockDeclarationNode";
import { TypeAliasDeclarationNode } from "../Nodes/TypeAliasDeclarationNode";
import { VariableDeclarationNode } from "../Nodes/VariableDeclarationNode";

// #region Functions (13)

function compareNodes(a: DeclarationNode, b: DeclarationNode, orderBy: ((node: DeclarationNode) => string)[])
{
    let valueA = orderBy[0](a);
    let valueB = orderBy[0](b);

    if (valueA > valueB)
    {
        return 1;
    }
    else if (valueA < valueB)
    {
        return -1;
    }
    else if (orderBy.length > 1)
    {
        return compareNodes(a, b, orderBy.slice(1));
    }
    else
    {
        return 0;
    }
}

function compareStrings(valueA: string, valueB: string)
{
    if (valueA > valueB)
    {
        return 1;
    }
    else if (valueA < valueB)
    {
        return -1;
    }
    else
    {
        return 0;
    }
}

function getNodeAccessor(node: DeclarationNode)
{
    if (node instanceof PropertyDeclarationNode ||
        node instanceof AccessorDeclarationNode ||
        node instanceof SetterDeclarationNode ||
        node instanceof GetterDeclarationNode ||
        node instanceof MethodDeclarationNode)
    {
        return node.accessModifier;
    }

    return "";
}

function getNodeName(node: DeclarationNode)
{
    return node.name.toLowerCase();
}

function getNodeType(declarationNode: DeclarationNode)
{
    // module member types
    if (declarationNode instanceof EnumDeclarationNode)
    {
        return "enum";
    }
    if (declarationNode instanceof InterfaceDeclarationNode)
    {
        return "interface";
    }
    else if (declarationNode instanceof ClassDeclarationNode)
    {
        return "class";
    }
    else if (declarationNode instanceof TypeAliasDeclarationNode)
    {
        return "type";
    }
    else if (declarationNode instanceof VariableDeclarationNode)
    {
        return "variable";
    }
    else if (declarationNode instanceof FunctionDeclarationNode)
    {
        return "function";
    }

    // interface / type alias member types
    if (declarationNode instanceof PropertySignatureDeclarationNode)
    {
        return "property signature";
    }
    else if (declarationNode instanceof IndexSignatureDeclarationNode)
    {
        return "index signature";
    }
    else if (declarationNode instanceof MethodSignatureDeclarationNode)
    {
        return "method signature";
    }

    // enum member types
    if (declarationNode instanceof EnumMemberDeclarationNode)
    {
        return "enum value";
    }

    // class member types
    if (declarationNode instanceof ConstDeclarationNode)
    {
        return "constant";
    }
    if (declarationNode instanceof PropertyDeclarationNode)
    {
        return "property";
    }
    else if (declarationNode instanceof ConstructorDeclarationNode ||
        declarationNode instanceof StaticCodeBlockDeclarationNode
    )
    {
        return "constructor";
    }
    else if (declarationNode instanceof AccessorDeclarationNode)
    {
        return "accessor";
    }
    else if (declarationNode instanceof GetterDeclarationNode)
    {
        return "getter";
    }
    else if (declarationNode instanceof SetterDeclarationNode)
    {
        return "setter";
    }
    else if (declarationNode instanceof MethodDeclarationNode)
    {
        return "method";
    }

    // empty
    if (declarationNode instanceof EmptyDeclarationNode)
    {
        return "";
    }

    return "-";
}

function getNodeTypeOrder(nodeType: string)
{
    // module member types
    if (nodeType === "enum")
    {
        return "101";
    }
    if (nodeType === "interface")
    {
        return "102";
    }
    else if (nodeType === "class")
    {
        return "103";
    }
    else if (nodeType === "type")
    {
        return "104";
    }
    else if (nodeType === "variable")
    {
        return "105";
    }
    else if (nodeType === "function")
    {
        return "106";
    }

    // interface / type alias member types
    if (nodeType === "property signature")
    {
        return "201";
    }
    else if (nodeType === "index signature")
    {
        return "202";
    }
    else if (nodeType === "method signature")
    {
        return "203";
    }

    // enum member types
    if (nodeType === "enum values")
    {
        return "301";
    }

    // class member types
    if (nodeType === "constant")
    {
        return "401";
    }
    if (nodeType === "property")
    {
        return "401";
    }
    else if (nodeType === "constructor")
    {
        return "402";
    }
    else if (nodeType === "static constructor")
    {
        return "403";
    }
    else if (nodeType === "accessor")
    {
        return "404";
    }
    else if (nodeType === "getter")
    {
        return "405";
    }
    else if (nodeType === "setter")
    {
        return "406";
    }
    else if (nodeType === "method")
    {
        return "407";
    }

    // empty
    if (nodeType === "")
    {
        return "501";
    }

    return "601";
}

export function groupByMemberTypeGroupByAccessorOrderByName(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getNodeType, getNodeAccessor, getNodeName]));
    nodes.forEach(n => orderByNodeTypeByName(n.children));

    return nodes;
}

export function groupByMemberTypeOrderByName(nodes: DeclarationNode[])
{
    for (const typeNode of nodes.sort((a, b) => compareNodes(a, b, [getNodeType, getNodeName])))
    {
        if (typeNode instanceof InterfaceDeclarationNode ||
            typeNode instanceof ClassDeclarationNode ||
            typeNode instanceof TypeAliasDeclarationNode)
        {
            typeNode.children = group(typeNode, typeNode.children, groupByType, (a, b) => compareStrings(getNodeTypeOrder(a), getNodeTypeOrder(b)));
        }

    }
    return nodes;
}

function group(parentNode: DeclarationNode | null, childrenNodes: DeclarationNode[], groupBy: (nodes: DeclarationNode[]) => Map<string, DeclarationNode[]>, orderBy: (a: string, b: string) => number)
{
    const nodeGroups = Array<DeclarationNode>();

    for (const [groupName, groupNodes] of [...groupBy(childrenNodes)].sort((a, b) => orderBy(a[0], b[0])))
    {
        nodeGroups.push(new DescriptionNode(groupName, parentNode, groupNodes.sort((a, b) => compareNodes(a, b, [(getNodeName)]))));
    }

    return nodeGroups;
}

function groupByType(nodes: DeclarationNode[])
{
    const groups = new Map<string, DeclarationNode[]>();

    for (const node of nodes)
    {
        let nodeType = getNodeType(node);

        if (groups.has(nodeType))
        {
            groups.get(nodeType)!.push(node);
        }
        else
        {
            groups.set(nodeType, [node]);
        }
    }

    return groups;
}

function groupByAccessor(nodes: DeclarationNode[])
{
    const groups = new Map<string, DeclarationNode[]>();

    for (const node of nodes)
    {
        let nodeAccessor = getNodeAccessor(node);

        if (groups.has(nodeAccessor))
        {
            groups.get(nodeAccessor)!.push(node);
        }
        else
        {
            groups.set(nodeAccessor, [node]);
        }
    }

    return groups;
}

export function orderByNodeType(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getNodeType]));
    nodes.forEach(n => orderByNodeType(n.children));

    return nodes;
}

export function orderByNodeTypeByAccessorByName(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getNodeType, getNodeAccessor, getNodeName]));
    nodes.forEach(n => orderByNodeTypeByName(n.children));

    return nodes;
}

export function orderByNodeTypeByName(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getNodeType, getNodeName]));
    nodes.forEach(n => orderByNodeTypeByName(n.children));

    return nodes;
}

export function orderByNone(nodes: DeclarationNode[])
{
    return nodes;
}

// #endregion Functions (13)
