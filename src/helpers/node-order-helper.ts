import { compareByType, compareByTypeByAccessor, compareByTypeByAccessorByName, compareByTypeByName } from "./node-compare-helper";

import { DeclarationNode } from "../Nodes/DeclarationNode";

// #region Functions (5)

export function order(nodes: DeclarationNode[], orderBy: (a: DeclarationNode, b: DeclarationNode) => number)
{
    nodes = nodes.sort(orderBy);
    nodes.forEach(n => order(n.children, orderBy));

    return nodes;
}

export function orderByType(nodes: DeclarationNode[])
{
    return order(nodes, compareByType);
}

export function orderByTypeByAccessor(nodes: DeclarationNode[])
{
    return order(nodes, compareByTypeByAccessor);
}

export function orderByTypeByAccessorByName(nodes: DeclarationNode[])
{
    return order(nodes, compareByTypeByAccessorByName);
}

export function orderByTypeByName(nodes: DeclarationNode[])
{
    return order(nodes, compareByTypeByName);
}

// #endregion Functions (5)
