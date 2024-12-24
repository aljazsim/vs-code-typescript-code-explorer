import { DescriptionNode } from "../nodes/DescriptionNode";
import { Node } from "../nodes/Node";

// #region Functions (3)

export function addMemberCount(node: Node)
{
    if (node instanceof DescriptionNode && node.children.length > 0 && !node.children.some(n => n instanceof DescriptionNode))
    {
        node.description = `${node.description} (${node.children.length})`;
    }
}

export function pluralize(node: Node)
{
    if (node instanceof DescriptionNode && getDescendantNodeCount(node) > 1)
    {
        node.description = pluralizeString(node.description as string ?? "");
    }
}

function getDescendantNodeCount(node: Node): number
{
    const childrenCount = node.children.filter(n => !(n instanceof DescriptionNode)).length;
    const subChildrenCount = node.children.map(n => getDescendantNodeCount(n)).reduce((sum, current) => sum + current, 0)


    return childrenCount + subChildrenCount;
}

function pluralizeString(noun: string)
{
    if (noun == "private" ||
        noun == "protected" ||
        noun == "public")
    {
        return noun;
    }
    if (noun.endsWith("y"))
    {
        return noun.substring(0, noun.length - 1) + "ies";
    }
    else if (noun.endsWith("x"))
    {
        return noun + "es";
    }
    else if (noun != "")
    {
        return noun + "s";
    }
    else
    {
        return noun;
    }
}

// #endregion Functions (3)
