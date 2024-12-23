import { compareByType, compareByTypeByAccessor, compareByTypeByAccessorByName, compareByTypeByName } from "./NodeComparisonHelper";
import { Node } from "../nodes/Node";

// #region Functions (5)

export function order(nodes: Node[], orderBy: ((a: Node, b: Node) => number))
{
    if (orderBy.length > 0)
    {
        nodes = nodes.sort(orderBy);
    }

    if (orderBy.length > 1)
    {
        for (const node of nodes)
        {
            node.children = order(node.children, orderBy);
        }
    }

    return nodes;
}

export function orderByType(nodes: Node[])
{
    return order(nodes, compareByType);
}

export function orderByTypeByAccessor(nodes: Node[])
{
    return order(nodes, compareByTypeByAccessor);
}

export function orderByTypeByAccessorByName(nodes: Node[])
{
    return order(nodes, compareByTypeByAccessorByName);
}

export function orderByTypeByName(nodes: Node[])
{
    return order(nodes, compareByTypeByName);
}

// #endregion Functions (5)
