import { getAccessorOrder, getName, getTypeOrder } from "./node-value-helper";

import { DeclarationNode } from "../Nodes/DeclarationNode";

// #region Functions (8)

function compare(a: DeclarationNode, b: DeclarationNode, orderBy: ((node: DeclarationNode) => string)[])
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

export function compareByAccessor(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getAccessorOrder]);
}

export function compareByAccessorByName(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getAccessorOrder, getName]);
}

export function compareByName(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getName]);
}

export function compareByType(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getTypeOrder]);
}

export function compareByTypeByAccessor(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getTypeOrder, getAccessorOrder]);
}

export function compareByTypeByAccessorByName(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getTypeOrder, getAccessorOrder, getName]);
}

export function compareByTypeByName(a: DeclarationNode, b: DeclarationNode)
{
    return compare(a, b, [getTypeOrder, getName]);
}

// #endregion Functions (8)
