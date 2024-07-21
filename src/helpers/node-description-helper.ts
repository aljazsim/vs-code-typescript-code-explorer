import { DescriptionNode } from "../Nodes/DescriptionNode";
import { Node } from "../Nodes/Node";

// #region Functions (3)

export function addMemberCount(node: Node)
{
    if (node instanceof DescriptionNode && node.children.length > 0)
    {
        node.description = `${node.description} (${node.children.length})`;
    }
}

export function pluralize(node: Node)
{
    if (node instanceof DescriptionNode && node.children.length > 1)
    {
        node.description = pluralizeString(node.description as string ?? "");
    }
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
    else if(noun != "")
    {
        return noun + "s";
    }
    else {
        return noun;
    }
}

// #endregion Functions (3)
