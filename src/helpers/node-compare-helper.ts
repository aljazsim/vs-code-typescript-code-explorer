import { getAccessorOrder, getName, getTypeOrder } from "./node-value-helper";
import { Node } from "../Nodes/Node";

// #region Functions (8)

function compare(a: Node, b: Node, orderBy: ((node: Node) => string)[])
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
        return compare(a, b, orderBy.slice(1));
    }
    else
    {
        return 0;
    }
}

export function compareByAccessor(a: Node, b: Node)
{
    return compare(a, b, [getAccessorOrder]);
}

export function compareByAccessorByName(a: Node, b: Node)
{
    return compare(a, b, [getAccessorOrder, getName]);
}

export function compareByName(a: Node, b: Node)
{
    return compare(a, b, [getName]);
}

export function compareByType(a: Node, b: Node)
{
    return compare(a, b, [getTypeOrder]);
}

export function compareByTypeByAccessor(a: Node, b: Node)
{
    return compare(a, b, [getTypeOrder, getAccessorOrder]);
}

export function compareByTypeByAccessorByName(a: Node, b: Node)
{
    return compare(a, b, [getTypeOrder, getAccessorOrder, getName]);
}

export function compareByTypeByName(a: Node, b: Node)
{
    return compare(a, b, [getTypeOrder, getName]);
}

// #endregion Functions (8)
