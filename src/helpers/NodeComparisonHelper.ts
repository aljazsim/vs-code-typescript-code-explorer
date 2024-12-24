import { Node } from "../nodes/Node";

// #region Type aliases (1)

export type compareBy = ((node: Node) => string);

// #endregion Type aliases (1)

// #region Functions (1)

export function compare(a: Node, b: Node, compareBy: compareBy[])
{
    let valueA = compareBy[0](a);
    let valueB = compareBy[0](b);

    if (valueA > valueB)
    {
        return 1;
    }
    else if (valueA < valueB)
    {
        return -1;
    }
    else if (compareBy.length > 1)
    {
        return compare(a, b, compareBy.slice(1));
    }
    else
    {
        return 0;
    }
}

// #endregion Functions (1)
