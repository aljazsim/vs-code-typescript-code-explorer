import { compareByAccessor, compareByName, compareByType, compareByTypeByAccessor, compareByTypeByAccessorByName, compareByTypeByName } from "./node-compare-helper";
import { getAccessor, getType } from "./node-value-helper";
import { order, orderByType, orderByTypeByAccessor, orderByTypeByAccessorByName, orderByTypeByName } from "./node-order-helper";

import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { DeclarationNode } from "../Nodes/DeclarationNode";
import { DescriptionNode } from "../Nodes/DescriptionNode";
import { InterfaceDeclarationNode } from "../Nodes/InterfaceDeclarationNode";
import { NodeOrderType } from "./node-order-type";
import { TypeAliasDeclarationNode } from "../Nodes/TypeAliasDeclarationNode";
import { pluralize } from "./node-description-helper";

// #region Functions (9)

function group(nodes: DeclarationNode[], groupBy: (nodes: DeclarationNode[]) => Map<string, DeclarationNode[]>)
{
    let groupedNodes = Array<DeclarationNode>();

    for (const [groupName, groupNodes] of [...groupBy(nodes)])
    {
        if (groupName === "")
        {
            groupNodes.forEach(n => groupedNodes.push(n));
        }
        else 
        {
            groupedNodes.push(new DescriptionNode(groupName, groupNodes[0].parent, groupNodes));
        }
    }

    return groupedNodes;
}

export function groupAndOrder(nodes: DeclarationNode[], nodeOrderType: NodeOrderType)
{
    if (nodeOrderType === NodeOrderType.orderByType)
    {
        return orderByType(nodes);
    }
    else if (nodeOrderType === NodeOrderType.orderByTypeByName)
    {
        return orderByTypeByName(nodes);
    }
    else if (nodeOrderType === NodeOrderType.orderByTypeByAccessor)
    {
        return orderByTypeByAccessor(nodes);
    }
    else if (nodeOrderType === NodeOrderType.orderByTypeByAccessorByName)
    {
        return orderByTypeByAccessorByName(nodes);
    }
    else if (nodeOrderType === NodeOrderType.groupByType)
    {
        return groupByType(nodes);
    }
    else if (nodeOrderType === NodeOrderType.groupByTypeOrderByName)
    {
        return groupByTypeOrderByTypeByName(nodes);
    }
    else if (nodeOrderType === NodeOrderType.groupByTypeOrderByAccessor)
    {
        return groupByTypeOrderByTypeByAccessor(nodes);
    }
    else if (nodeOrderType === NodeOrderType.groupByTypeOrderByAccessorByName)
    {
        return groupByTypeOrderByTypeByAccessorByName(nodes);
    }
    else if (nodeOrderType === NodeOrderType.groupByTypeByAccessorOrderByTypeByAccessorByName)
    {
        return groupByTypeByAccessorOrderByTypeByAccessorByName(nodes);
    }
    else
    {
        return nodes;
    }
}

function groupByType(nodes: DeclarationNode[])
{
    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes.forEach(n => pluralize(n.children));
    }

    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children.forEach(n => pluralize(n.children));
        }
    }

    return nodes;
}

function groupByTypeOrderByTypeByAccessor(nodes: DeclarationNode[])
{
    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByTypeByAccessor);
        nodes.forEach(n => pluralize(n.children));
    }

    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByTypeByAccessor);
            node.children.forEach(n => pluralize(n.children));
        }
    }

    return nodes;
}

function groupByTypeOrderByTypeByAccessorByName(nodes: DeclarationNode[])
{
    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByTypeByAccessorByName);
        nodes.forEach(n => pluralize(n.children));
    }

    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByTypeByAccessorByName);
            node.children.forEach(n => pluralize(n.children));
        }
    }

    return nodes;
}

function groupByTypeByAccessorOrderByTypeByAccessorByName(nodes: DeclarationNode[])
{
    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByTypeByName);
        nodes.forEach(n => pluralize(n.children));

        for (const typeGroup of nodes)
        {
            typeGroup.children = group(typeGroup.children, mergeByAccessor);
            typeGroup.children = order(typeGroup.children, compareByAccessor);

            for (const accessorGroup of typeGroup.children)
            {
                accessorGroup.children = order(accessorGroup.children, compareByName);
            }
        }
    }

    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByType);
            node.children.forEach(n => pluralize(n.children));

            for (const typeGroup of node.children)
            {
                typeGroup.children = group(typeGroup.children, mergeByAccessor);
                typeGroup.children = order(typeGroup.children, compareByAccessor);

                for (const accessorGroup of typeGroup.children)
                {
                    accessorGroup.children = order(accessorGroup.children, compareByName);
                }
            }
        }
    }

    return nodes;
}

function groupByTypeOrderByTypeByName(nodes: DeclarationNode[])
{
    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByTypeByName);
        nodes.forEach(n => pluralize(n.children));
    }

    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByTypeByName);
            node.children.forEach(n => pluralize(n.children));
        }
    }

    return nodes;
}

function merge(nodes: DeclarationNode[], mergeBy: (n: DeclarationNode) => string)
{
    const groups = new Map<string, DeclarationNode[]>();

    for (const node of nodes)
    {
        const nodeKey = mergeBy(node);

        if (groups.has(nodeKey))
        {
            groups.get(nodeKey)!.push(node);
        }
        else
        {
            groups.set(nodeKey, [node]);
        }
    }

    return groups;
}

function mergeByAccessor(nodes: DeclarationNode[])
{
    return merge(nodes, getAccessor);
}

function mergeByType(nodes: DeclarationNode[])
{
    return merge(nodes, getType);
}

// #endregion Functions (9)
