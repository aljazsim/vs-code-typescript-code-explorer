import { Node } from "../nodes/Node";

export type mergeBy = (node: Node) => string;

export function merge(nodes: Node[], mergeBy: mergeBy)
{
    const groups = new Map<string, Node[]>();

    for (const node of nodes)
    {
        const nodeKey = mergeBy(node);

        if (groups.has(nodeKey))
        {
            groups.get(nodeKey)!.push(node);
        }
        else
        {
            groups.set(nodeKey, [node]);
        }
    }

    return groups;
}
