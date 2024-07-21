import * as path from "path";

export abstract class NodeImages
{
    // #region Properties (50)

    private static readonly imageDir = path.join(__filename, "..", "..", "..", "resources");

    public static readonly class = path.join(this.imageDir, "members", "class.svg");
    public static readonly classExported = path.join(this.imageDir, "members", "class-exported.svg");
    public static readonly constVariable = path.join(this.imageDir, "members", "const-variable.svg");
    public static readonly constVariableExported = path.join(this.imageDir, "members", "const-variable-exported.svg");
    public static readonly constructorPublic = path.join(this.imageDir, "members", "constructor-public.svg");
    public static readonly constructorPublicStatic = path.join(this.imageDir, "members", "constructor-public-static.svg");
    public static readonly enum = path.join(this.imageDir, "members", "enum.svg");
    public static readonly enumExported = path.join(this.imageDir, "members", "enum-exported.svg");
    public static readonly enumMember = path.join(this.imageDir, "members", "enum-member.svg");
    public static readonly function = path.join(this.imageDir, "members", "function.svg");
    public static readonly functionAsync = path.join(this.imageDir, "members", "function-async.svg");
    public static readonly functionExported = path.join(this.imageDir, "members", "function-exported.svg");
    public static readonly functionExportedAsync = path.join(this.imageDir, "members", "function-exported-async.svg");
    public static readonly interface = path.join(this.imageDir, "members", "interface.svg");
    public static readonly interfaceExported = path.join(this.imageDir, "members", "interface-exported.svg");
    public static readonly methodPrivate = path.join(this.imageDir, "members", "method-private.svg");
    public static readonly methodPrivateAsync = path.join(this.imageDir, "members", "method-private-async.svg");
    public static readonly methodPrivateStatic = path.join(this.imageDir, "members", "method-private-static.svg");
    public static readonly methodPrivateStaticAsync = path.join(this.imageDir, "members", "method-private-static-async.svg");
    public static readonly methodProtected = path.join(this.imageDir, "members", "method-protected.svg");
    public static readonly methodProtectedAbstract = path.join(this.imageDir, "members", "method-protected-abstract.svg");
    public static readonly methodProtectedAbstractAsync = path.join(this.imageDir, "members", "method-protected-abstract-async.svg");
    public static readonly methodProtectedAsync = path.join(this.imageDir, "members", "method-protected-async.svg");
    public static readonly methodProtectedStatic = path.join(this.imageDir, "members", "method-protected-static.svg");
    public static readonly methodProtectedStaticAsync = path.join(this.imageDir, "members", "method-protected-static-async.svg");
    public static readonly methodPublic = path.join(this.imageDir, "members", "method-public.svg");
    public static readonly methodPublicAbstract = path.join(this.imageDir, "members", "method-public-abstract.svg");
    public static readonly methodPublicAbstractAsync = path.join(this.imageDir, "members", "method-public-abstract-async.svg");
    public static readonly methodPublicAsync = path.join(this.imageDir, "members", "method-public-async.svg");
    public static readonly methodPublicStatic = path.join(this.imageDir, "members", "method-public-static.svg");
    public static readonly methodPublicStaticAsync = path.join(this.imageDir, "members", "method-public-static-async.svg");
    public static readonly propertyPrivate = path.join(this.imageDir, "members", "property-private.svg");
    public static readonly propertyPrivateStatic = path.join(this.imageDir, "members", "property-private-static.svg");
    public static readonly propertyProtected = path.join(this.imageDir, "members", "property-protected.svg");
    public static readonly propertyProtectedAbstract = path.join(this.imageDir, "members", "property-protected-abstract.svg");
    public static readonly propertyProtectedStatic = path.join(this.imageDir, "members", "property-protected-static.svg");
    public static readonly propertyPublic = path.join(this.imageDir, "members", "property-public.svg");
    public static readonly propertyPublicAbstract = path.join(this.imageDir, "members", "property-public-abstract.svg");
    public static readonly propertyPublicStatic = path.join(this.imageDir, "members", "property-public-static.svg");
    public static readonly readonlyPropertyPrivate = path.join(this.imageDir, "members", "readonly-property-private.svg");
    public static readonly readonlyPropertyPrivateStatic = path.join(this.imageDir, "members", "readonly-property-private-static.svg");
    public static readonly readonlyPropertyProtected = path.join(this.imageDir, "members", "readonly-property-protected.svg");
    public static readonly readonlyPropertyProtectedStatic = path.join(this.imageDir, "members", "readonly-property-protected-static.svg");
    public static readonly readonlyPropertyPublic = path.join(this.imageDir, "members", "readonly-property-public.svg");
    public static readonly readonlyPropertyPublicStatic = path.join(this.imageDir, "members", "readonly-property-public-static.svg");
    public static readonly type = path.join(this.imageDir, "members", "type.svg");
    public static readonly typeExported = path.join(this.imageDir, "members", "type-exported.svg");
    public static readonly variable = path.join(this.imageDir, "members", "variable.svg");
    public static readonly variableExported = path.join(this.imageDir, "members", "variable-exported.svg");

    // #endregion Properties (50)
}
