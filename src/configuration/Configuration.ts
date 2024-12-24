import * as vscode from "vscode";

import { NodeGroupingAndOrderType } from "../enums/NodeGroupingAndOrderType";

export class Configuration
{
    // #region Constructors (1)

    constructor(
        public readonly groupingAndOrder: NodeGroupingAndOrderType,
        public readonly showMemberTypes: boolean,
        public readonly showAccessorColorCoding: boolean,
        public readonly showStaticMemberIndicator: boolean,
        public readonly showAbstractMemberIndicator: boolean,
        public readonly showMemberCount: boolean,
        public readonly showReadonlyPropertiesAsConst: boolean,
        public readonly showConstVariablesAsConst: boolean,
        public readonly showArrowFunctionPropertiesAsMethods: boolean,
        public readonly showReadonlyArrowFunctionPropertiesAsMethods: boolean,
        public readonly showArrowFunctionVariablesAsMethods: boolean,
        public readonly showArrowFunctionConstVariablesAsMethods: boolean,
        public readonly showAsyncMethodIndicator: boolean
    )
    {
    }

    // #endregion Constructors (1)

    // #region Public Static Methods (1)

    public static getConfiguration()
    {
        let configuration = vscode.workspace.getConfiguration("tsce");

        return new Configuration(
            this.toGroupingAndOrder(configuration.get<string>("groupingAndOrder") ?? ""),
            configuration.get<boolean>("showMemberTypes") === true,
            configuration.get<boolean>("showAccessorColorCoding") === true,
            configuration.get<boolean>("showStaticMemberIndicator") === true,
            configuration.get<boolean>("showAbstractMemberIndicator") === true,
            configuration.get<boolean>("showMemberCount") === true,
            configuration.get<boolean>("showReadonlyPropertiesAsConst") === true,
            configuration.get<boolean>("showConstVariablesAsConst") === true,
            configuration.get<boolean>("showArrowFunctionPropertiesAsMethods") === true,
            configuration.get<boolean>("showArrowFunctionReadOnlyPropertiesAsMethods") === true,
            configuration.get<boolean>("showArrowFunctionVariablesAsMethods") === true,
            configuration.get<boolean>("showArrowFunctionConstVariablesAsMethods") === true,
            configuration.get<boolean>("showAsyncMethodIndicator") === true
        );
    }

    // #endregion Public Static Methods (1)

    // #region Private Static Methods (1)

    private static toGroupingAndOrder(value: string)
    {
        if (value === "order by: type")
        {
            return NodeGroupingAndOrderType.orderByType;
        }
        else if (value === "order by: type/name")
        {
            return NodeGroupingAndOrderType.orderByTypeByName;
        }
        else if (value === "order by: type/accessor")
        {
            return NodeGroupingAndOrderType.orderByTypeByAccessor;
        }
        else if (value === "order by: type/accessor/name")
        {
            return NodeGroupingAndOrderType.orderByTypeByAccessorByName;
        }
        else if (value === "group by: type, order by type")
        {
            return NodeGroupingAndOrderType.groupByTypeOrderByType;
        }
        else if (value === "group by: type, order by: type/name")
        {
            return NodeGroupingAndOrderType.groupByTypeOrderByTypeByName;
        }
        else if (value === "group by: type, order by: type/accessor")
        {
            return NodeGroupingAndOrderType.groupByTypeOrderByTypeByAccessor;
        }
        else if (value === "group by: type, order by: type/accessor/name")
        {
            return NodeGroupingAndOrderType.groupByTypeOrderByTypeByAccessorByName;
        }
        else if (value === "group by: type/accessor, order by: type/accessor/name")
        {
            return NodeGroupingAndOrderType.groupByTypeByAccessorOrderByTypeByAccessorByName;
        }

        return NodeGroupingAndOrderType.none;
    }

    // #endregion Private Static Methods (1)
}
