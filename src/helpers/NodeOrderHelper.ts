import { compare, compareBy } from "./NodeComparisonHelper";
import { Node } from "../nodes/Node";
import { getAccessorOrder, getMemberType, getName, getTypeMemberOrder, getTypeOrder } from "./NodeValueHelper";

export type order = (nodes: Node[]) => Node[];

function orderBy(nodes: Node[], compareBy: compareBy[])
{
    nodes = nodes.sort((a, b) => compare(a, b, compareBy));
    nodes.forEach(n => n.children = orderBy(n.children, compareBy));

    return nodes;
}

export function orderByType(nodes: Node[])
{
    return orderBy(nodes, [getTypeOrder, getTypeMemberOrder]);
}

export function orderByTypeByAccessor(nodes: Node[])
{
    return orderBy(nodes, [getTypeOrder, getTypeMemberOrder, getAccessorOrder]);
}

export function orderByTypeByAccessorByName(nodes: Node[])
{
    return orderBy(nodes, [getTypeOrder, getTypeMemberOrder, getAccessorOrder, getName]);
}

export function orderByTypeByName(nodes: Node[])
{
    return orderBy(nodes, [getTypeOrder, getTypeMemberOrder, getName]);
}
