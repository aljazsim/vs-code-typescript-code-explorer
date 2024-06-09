import { addMemberCount, pluralize } from "./node-description-helper";
import { compareByAccessor, compareByAccessorByName, compareByName, compareByType, compareByTypeByName } from "./node-compare-helper";
import { getAccessor, getType } from "./node-value-helper";
import { order, orderByType, orderByTypeByAccessor, orderByTypeByAccessorByName, orderByTypeByName } from "./node-order-helper";

import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { DeclarationNode } from "../Nodes/DeclarationNode";
import { DescriptionNode } from "../Nodes/DescriptionNode";
import { InterfaceDeclarationNode } from "../Nodes/InterfaceDeclarationNode";
import { NodeGroupingAndOrderType } from "./node-grouping-and-order-type";
import { TypeAliasDeclarationNode } from "../Nodes/TypeAliasDeclarationNode";

// #region Functions (10)

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

export function groupAndOrder(nodes: DeclarationNode[], nodeOrderType: NodeGroupingAndOrderType, showMemberCount: boolean)
{
    if (nodeOrderType === NodeGroupingAndOrderType.orderByType)
    {
        return orderByType(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.orderByTypeByName)
    {
        return orderByTypeByName(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.orderByTypeByAccessor)
    {
        return orderByTypeByAccessor(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.orderByTypeByAccessorByName)
    {
        return orderByTypeByAccessorByName(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByType)
    {
        return groupByType(nodes, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByName)
    {
        return groupByTypeOrderByName(nodes, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByAccessor)
    {
        return groupByTypeOrderByAccessor(nodes, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByAccessorByName)
    {
        return groupByTypeOrderByAccessorByName(nodes, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeByAccessorOrderByTypeByAccessorByName)
    {
        return groupByTypeByAccessorOrderByTypeByAccessorByName(nodes, showMemberCount);
    }
    else
    {
        return nodes;
    }
}

function groupByType(nodes: DeclarationNode[], showMemberCount: boolean)
{
    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children.forEach(n => pluralize(n));
            node.children.forEach(n => showMemberCount && addMemberCount(n));
        }
    }

    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes.forEach(n => pluralize(n));
        nodes.forEach(n => showMemberCount && addMemberCount(n));
    }

    return nodes;
}

function groupByTypeByAccessorOrderByTypeByAccessorByName(nodes: DeclarationNode[], showMemberCount: boolean)
{
    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByType);
            node.children.forEach(n => pluralize(n));
            node.children.forEach(n => showMemberCount && addMemberCount(n));

            for (const typeGroup of node.children)
            {
                typeGroup.children = group(typeGroup.children, mergeByAccessor);
                typeGroup.children = order(typeGroup.children, compareByAccessor);
                typeGroup.children.forEach(n => n.children = order(n.children, compareByName));
                typeGroup.children.forEach(n => showMemberCount && addMemberCount(n));
            }
        }
    }

    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByTypeByName);
        nodes.forEach(n => pluralize(n));
        nodes.forEach(n => showMemberCount && addMemberCount(n));

        for (const typeGroup of nodes)
        {
            typeGroup.children = group(typeGroup.children, mergeByAccessor);
            typeGroup.children = order(typeGroup.children, compareByAccessor);
            typeGroup.children.forEach(n => n.children = order(n.children, compareByName));
            typeGroup.children.forEach(n => showMemberCount && addMemberCount(n));
        }
    }

    return nodes;
}

function groupByTypeOrderByAccessor(nodes: DeclarationNode[], showMemberCount: boolean)
{
    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByType);
            node.children.forEach(n => n.children = order(n.children, compareByAccessor));
            node.children.forEach(n => pluralize(n));
            node.children.forEach(n => showMemberCount && addMemberCount(n));
        }
    }

    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByType);
        nodes.forEach(n => n.children = order(n.children, compareByAccessor));
        nodes.forEach(n => pluralize(n));
        nodes.forEach(n => showMemberCount && addMemberCount(n));
    }

    return nodes;
}

function groupByTypeOrderByAccessorByName(nodes: DeclarationNode[], showMemberCount: boolean)
{
    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByType);
            node.children.forEach(n => n.children = order(n.children, compareByAccessorByName));
            node.children.forEach(n => pluralize(n));
            node.children.forEach(n => showMemberCount && addMemberCount(n));
        }
    }

    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByType);
        nodes.forEach(n => n.children = order(n.children, compareByAccessorByName));
        nodes.forEach(n => pluralize(n));
        nodes.forEach(n => showMemberCount && addMemberCount(n));
    }

    return nodes;
}

function groupByTypeOrderByName(nodes: DeclarationNode[], showMemberCount: boolean)
{
    for (const node of nodes)
    {
        if (node instanceof InterfaceDeclarationNode ||
            node instanceof ClassDeclarationNode ||
            node instanceof TypeAliasDeclarationNode)
        {
            node.children = group(node.children, mergeByType);
            node.children = order(node.children, compareByTypeByName);
            node.children.forEach(n => pluralize(n));
            node.children.forEach(n => showMemberCount && addMemberCount(n));
        }
    }

    if (nodes.length > 1)
    {
        nodes = group(nodes, mergeByType);
        nodes = order(nodes, compareByTypeByName);
        nodes.forEach(n => pluralize(n));
        nodes.forEach(n => showMemberCount && addMemberCount(n));
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

// #endregion Functions (10)
