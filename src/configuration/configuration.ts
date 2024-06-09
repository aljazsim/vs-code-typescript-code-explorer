import { NodeOrderType } from "../helpers/node-order-type";

export class Configuration
{
    constructor(
        public readonly showNumberOfMembers: boolean,
        public readonly showReadonlyPropertiesAsConst: boolean,
        public readonly showConstVariablesAsConst: boolean,
        public readonly showArrowFunctionPropertiesAsMethods: boolean,
        public readonly showReadonlyArrowFunctionPropertiesAsMethods: boolean,
        public readonly showArrowFunctionVariablesAsMethods: boolean,
        public readonly showArrowFunctionConstAsMethods: boolean,
        public readonly showStaticMemberIndicator: boolean,
        public readonly showAbstractMemberIndicator: boolean,
        public readonly showParameters: boolean,
        public readonly showParameterTypes: boolean,
        public readonly showReturnTypes: boolean,
        public readonly showPropertyTypes: boolean,
        public readonly showAnyIfTypeNotSpecified: boolean,
        public readonly showAccessorColorCoding: boolean,
        public readonly order: NodeOrderType
    )
    {
    }
}
