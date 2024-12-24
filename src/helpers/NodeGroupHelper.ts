import { DescriptionNode } from "../nodes/DescriptionNode";
import { Node } from "../nodes/Node";
import { getAccessor, getMemberType, getType } from "./NodeValueHelper";
import { merge, mergeBy } from "./NodeMergeHelper";

export type group = (nodes: Node[]) => Node[];

function groupBy(nodes: Node[], mergeBy: mergeBy[])
{
    let descriptionNodes = Array<Node>();

    for (const [groupName, groupNodes] of [...merge(nodes, mergeBy[0])])
    {
        if (groupName === "")
        {
            groupNodes.forEach(n => descriptionNodes.push(n));
        }
        else 
        {
            descriptionNodes.push(new DescriptionNode(groupName, groupNodes[0].parent, groupNodes));
        }
    }

    if (mergeBy.length > 1)
    {
        for (const descriptionNode of descriptionNodes)
        {
            for (const parentNode of descriptionNode.children)
            {
                parentNode.children = groupBy(parentNode.children, mergeBy.slice(1));
            }
        }
    }

    return descriptionNodes;
}

export function groupByTypeByAccessor(nodes: Node[])
{
    return groupBy(nodes, [getType, getMemberType, getAccessor]);
}

export function groupByType(nodes: Node[])
{
    return groupBy(nodes, [getType, getMemberType]);
}
