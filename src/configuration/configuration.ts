export class Configuration
{
    constructor(
        showReadonlyPropertiesAsConst: boolean,
        showConstVariablesAsConst: boolean,
        showArrowFunctionPropertiesAsMethods: boolean,
        showReadonlyArrowFunctionPropertiesAsMethods: boolean,
        showArrowFunctionVariablesAsMethods: boolean,
        showConstArrowFunctionVariablesAsMethods: boolean,
        showStaticMemberIndicator: boolean,
        showAbstractMemberIndicator: boolean,
        showAsyncMemberIndicator: boolean,
        orderBy: "none" | "order by member type" | "order by member type, order by member accessor" | "group by member type, order by member name" | "group by member type, group by member accessor, order by member name"
    )
    {
    }
}
