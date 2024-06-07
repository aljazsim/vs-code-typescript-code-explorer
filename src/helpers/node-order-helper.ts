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

// #region Functions (14)

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

function getAccessorOrder(node: DeclarationNode)
{
    if (node instanceof InterfaceDeclarationNode ||
        node instanceof TypeAliasDeclarationNode ||
        node instanceof ClassDeclarationNode ||
        node instanceof FunctionDeclarationNode ||
        node instanceof VariableDeclarationNode)
    {
        if (node.isExport)
        {
            return "102";
        }
        else
        {
            return "101";
        }
    }
    else if (node instanceof PropertyDeclarationNode ||
        node instanceof AccessorDeclarationNode ||
        node instanceof SetterDeclarationNode ||
        node instanceof GetterDeclarationNode ||
        node instanceof MethodDeclarationNode)
    {
        if (node.accessModifier === "private")
        {
            return "201";
        }
        else if (node.accessModifier === "protected")
        {
            return "202";
        }
        else if (node.accessModifier === "public")
        {
            return "203";
        }
    }

    return "";
}

function getName(node: DeclarationNode)
{
    return node.name.toLowerCase();
}

function getType(declarationNode: DeclarationNode)
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
        return "property";
    }
    else if (declarationNode instanceof IndexSignatureDeclarationNode)
    {
        return "index";
    }
    else if (declarationNode instanceof MethodSignatureDeclarationNode)
    {
        return "method";
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
        declarationNode instanceof StaticCodeBlockDeclarationNode)
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

function getTypeOrder(nodeType: string)
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

    // enum member types
    if (nodeType === "enum values")
    {
        return "301";
    }

    // interface/type/class member types
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
    else if (nodeType === "index")
    {
        return "404";
    }
    else if (nodeType === "accessor")
    {
        return "405";
    }
    else if (nodeType === "getter")
    {
        return "406";
    }
    else if (nodeType === "setter")
    {
        return "407";
    }
    else if (nodeType === "method")
    {
        return "408";
    }

    // empty
    if (nodeType === "")
    {
        return "501";
    }

    return "601";
}

function group(parentNode: DeclarationNode | null, childNodes: DeclarationNode[], groupBy: (nodes: DeclarationNode[]) => Map<string, DeclarationNode[]>, groupsOrderBy: (a: DeclarationNode, b: DeclarationNode) => number, childrenOrderBy: (a: DeclarationNode, b: DeclarationNode) => number)
{
    let groupedChildNodes = Array<DeclarationNode>();

    for (const [groupName, groupNodes] of [...groupBy(childNodes)])
    {
        groupedChildNodes.push(new DescriptionNode(groupName, parentNode, groupNodes.sort(childrenOrderBy)));
    }

    groupedChildNodes = groupedChildNodes.sort(groupsOrderBy);

    for (const groupNode of groupedChildNodes)
    {
        if (groupNode.children.length > 1)
        {
            groupNode.label = pluralize(groupNode.label as string ?? "");
        }
    }

    return groupedChildNodes;
}

function groupByType(nodes: DeclarationNode[])
{
    const groups = new Map<string, DeclarationNode[]>();

    for (const node of nodes)
    {
        let nodeType = getType(node);

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

export function groupByTypeOrderByName(nodes: DeclarationNode[])
{
    if (nodes.length > 1)
    {
        nodes = group(null, nodes, groupByType, (a, b) => compareNodes(a, b, [n => getTypeOrder(n.name)]), (a, b) => compareNodes(a, b, [getAccessorOrder, getName]));
    }

    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node, node.children, groupByType, (a, b) => compareNodes(a, b, [n => getTypeOrder(n.name)]), (a, b) => compareNodes(a, b, [getAccessorOrder, getName]));
        }
    }

    return nodes;
}

export function orderByNone(nodes: DeclarationNode[])
{
    return nodes;
}

export function orderByType(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getType]));
    nodes.forEach(n => orderByType(n.children));

    return nodes;
}

export function orderByTypeByAccessorByName(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getType, getAccessorOrder, getName]));
    nodes.forEach(n => orderByTypeByName(n.children));

    return nodes;
}

export function orderByTypeByName(nodes: DeclarationNode[])
{
    nodes = nodes.sort((a, b) => compareNodes(a, b, [getType, getName]));
    nodes.forEach(n => orderByTypeByName(n.children));

    return nodes;
}

function pluralize(noun: string)
{
    if (noun.endsWith("y"))
    {
        return noun.substring(0, noun.length - 1) + "ies";
    }
    else
    {
        return noun + "s";
    }
}

// #endregion Functions (14)
