import { DescriptionNode } from "../nodes/DescriptionNode";
import { Node } from "../nodes/Node";
import { getAccessor, getMemberType, getType } from "./NodeValueHelper";
import { merge, mergeBy } from "./NodeMergeHelper";

// #region Type aliases (1)

export type group = (nodes: Node[]) => Node[];

// #endregion Type aliases (1)

// #region Functions (3)

function groupBy(nodes: Node[], mergeBy: mergeBy[][])
{
    let descriptionNodes = Array<Node>();

    if (mergeBy.length > 1)
    {
        // recursively group children
        nodes.forEach(n => n.children = groupBy(n.children, mergeBy.slice(1)))
    }

    if (mergeBy.length >= 1)
    {
        if (mergeBy[0].length >= 1)
        {
            for (const [groupName, groupNodes] of [...merge(nodes, mergeBy[0][0])])
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
        }

        if (mergeBy[0].length > 1)
        {
            // recursively group current node
            descriptionNodes.forEach(dn => dn.children = groupBy(dn.children, [mergeBy[0].slice(1)]));
        }
    }

    return descriptionNodes;
}

export function groupByType(nodes: Node[])
{
    return groupBy(nodes, [[getType], [getMemberType]]);
}

export function groupByTypeByAccessor(nodes: Node[])
{
    return groupBy(nodes, [[getType], [getMemberType, getAccessor]]);
}

// #endregion Functions (3)
