import { addMemberCount, pluralize } from "./NodeDescriptionHelper";
import { order, orderByType, orderByTypeByAccessor, orderByTypeByAccessorByName, orderByTypeByName } from "./NodeOrderHelper";
import { NodeGroupingAndOrderType } from "../enums/NodeGroupingAndOrderType";
import { Node } from "../nodes/Node";
import { group, groupByType, groupByTypeByAccessor } from "./NodeGroupHelper";
import { DescriptionNode } from "../nodes/DescriptionNode";

// #region Functions (3)

export function groupAndOrder(nodes: Node[], nodeOrderType: NodeGroupingAndOrderType, showMemberCount: boolean)
{
    if (nodeOrderType === NodeGroupingAndOrderType.orderByType)
    {
        return orderByType(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.orderByTypeByName)
    {
        return orderByTypeByName(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.orderByTypeByAccessor)
    {
        return orderByTypeByAccessor(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.orderByTypeByAccessorByName)
    {
        return orderByTypeByAccessorByName(nodes);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByType)
    {
        return organize(nodes, groupByType, orderByType, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByTypeByName)
    {
        return organize(nodes, groupByType, orderByTypeByName, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByTypeByAccessor)
    {
        return organize(nodes, groupByType, orderByTypeByAccessor, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeOrderByTypeByAccessorByName)
    {
        return organize(nodes, groupByType, orderByTypeByAccessorByName, showMemberCount);
    }
    else if (nodeOrderType === NodeGroupingAndOrderType.groupByTypeByAccessorOrderByTypeByAccessorByName)
    {
        return organize(nodes, groupByTypeByAccessor, orderByTypeByAccessorByName, showMemberCount);
    }
    else
    {
        return nodes;
    }
}

function modifyRecursively(nodes: Node[], showMemberCount: boolean)
{
    nodes.forEach(n => pluralize(n));
    nodes.forEach(n => showMemberCount && addMemberCount(n));

    nodes.forEach(n => n.children = modifyRecursively(n.children, showMemberCount));

    return nodes;
}

function organize(nodes: Node[], group: group, order: order, showMemberCount: boolean)
{
    nodes = group(nodes);
    nodes = order(nodes);
    nodes = modifyRecursively(nodes, showMemberCount);

    if (nodes.length == 1 && nodes[0] instanceof DescriptionNode && nodes[0].children.length == 1 && !(nodes[0].children[0] instanceof DescriptionNode))
    {
        // top grouping only has one child -> remove grouping
        return nodes[0].children;
    }
    else
    {
        return nodes;
    }
}

// #endregion Functions (3)
