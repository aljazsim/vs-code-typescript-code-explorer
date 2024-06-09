import { DeclarationNode } from "../Nodes/DeclarationNode";

// #region Functions (2)

export function pluralize(nodes: DeclarationNode[])
{
    for (const node of nodes)
    {
        if (node.children.length > 1)
        {
            node.description = pluralizeString(node.description as string ?? "");
        }
    }

    return nodes;
}

function pluralizeString(noun: string)
{
    if (noun.endsWith("y"))
    {
        return noun.substring(0, noun.length - 1) + "ies";
    }
    else if (noun.endsWith("x"))
    {
        return noun + "es";
    }
    else
    {
        return noun + "s";
    }
}

// #endregion Functions (2)
