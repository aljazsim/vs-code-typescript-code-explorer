import * as path from "path";
import * as vscode from "vscode";

export abstract class DeclarationNode extends vscode.TreeItem
{
    // #region Properties (46)

    private readonly imageDir = path.join(__filename, "..", "..", "..", "resources");

    protected readonly abstractImage = this.convertHexToString("e29db4") + "..." + this.convertHexToString("e29db5");
    protected readonly privateImage = this.convertHexToString("f09f9492");
    protected readonly protectedImage = this.convertHexToString("f09f9493");

    protected readonly classDarkIconFilePath = path.join(this.imageDir, "member-types", 'Class_dark.svg');
    protected readonly classLightIconFilePath = path.join(this.imageDir, "member-types", 'Class_light.svg');
    protected readonly constantDarkIconFilePath = path.join(this.imageDir, "member-types", 'Constant_dark.svg');
    protected readonly constantLightIconFilePath = path.join(this.imageDir, "member-types", 'Constant_light.svg');
    protected readonly constructorDarkIconFilePath = path.join(this.imageDir, "member-types", 'Constructor_dark.svg');
    protected readonly constructorLightIconFilePath = path.join(this.imageDir, "member-types", 'Constructor_light.svg');
    protected readonly staticCodeBlocDarkIconFilePath = path.join(this.imageDir, "member-types", 'StaticCodeBlock_dark.svg');
    protected readonly staticCodeBlocLightIconFilePath = path.join(this.imageDir, "member-types", 'StaticCodeBlock_light.svg');
    protected readonly enumeratorDarkIconFilePath = path.join(this.imageDir, "member-types", 'Enumerator_dark.svg');
    protected readonly enumeratorItemDarkIconFilePath = path.join(this.imageDir, "member-types", 'EnumeratorItem_dark.svg');
    protected readonly enumeratorItemLightIconFilePath = path.join(this.imageDir, "member-types", 'EnumeratorItem_light.svg');
    protected readonly enumeratorLightIconFilePath = path.join(this.imageDir, "member-types", 'Enumerator_light.svg');
    protected readonly eventItemDarkIconFilePath = path.join(this.imageDir, "member-types", 'Event_dark.svg');
    protected readonly eventItemLightIconFilePath = path.join(this.imageDir, "member-types", 'Event_light.svg');
    protected readonly fieldItemDarkIconFilePath = path.join(this.imageDir, "member-types", 'Field_dark.svg');
    protected readonly fieldItemLightIconFilePath = path.join(this.imageDir, "member-types", 'Field_light.svg');
    protected readonly variableItemDarkIconFilePath = path.join(this.imageDir, "member-types", 'Variable_dark.svg');
    protected readonly variableItemLightIconFilePath = path.join(this.imageDir, "member-types", 'Variable_light.svg');
    protected readonly fieldStaticDarkIconFilePath = path.join(this.imageDir, "member-types", 'FieldStatic_dark.svg');
    protected readonly fieldStaticLightIconFilePath = path.join(this.imageDir, "member-types", 'FieldStatic_light.svg');
    protected readonly functionDarkIconFilePath = path.join(this.imageDir, "member-types", 'Function_dark.svg');
    protected readonly functionLightIconFilePath = path.join(this.imageDir, "member-types", 'Function_light.svg');
    protected readonly getterDarkIconFilePath = path.join(this.imageDir, "member-types", 'Getter_dark.svg');
    protected readonly getterLightIconFilePath = path.join(this.imageDir, "member-types", 'Getter_light.svg');
    protected readonly accessorDarkIconFilePath = path.join(this.imageDir, "member-types", 'Accessor_dark.svg');
    protected readonly accessorLightIconFilePath = path.join(this.imageDir, "member-types", 'Accessor_light.svg');
    protected readonly interfaceDarkIconFilePath = path.join(this.imageDir, "member-types", 'Interface_dark.svg');
    protected readonly interfaceLightIconFilePath = path.join(this.imageDir, "member-types", 'Interface_light.svg');
    protected readonly methodDarkIconFilePath = path.join(this.imageDir, "member-types", 'Method_dark.svg');
    protected readonly methodLightIconFilePath = path.join(this.imageDir, "member-types", 'Method_light.svg');
    protected readonly namespaceDarkIconFilePath = path.join(this.imageDir, "member-types", 'Namespace_dark.svg');
    protected readonly namespaceLightIconFilePath = path.join(this.imageDir, "member-types", 'Namespace_light.svg');
    protected readonly operatorDarkIconFilePath = path.join(this.imageDir, "member-types", 'Operator_dark.svg');
    protected readonly operatorLightIconFilePath = path.join(this.imageDir, "member-types", 'Operator_light.svg');
    protected readonly propertyDarkIconFilePath = path.join(this.imageDir, "member-types", 'Property_dark.svg');
    protected readonly propertyLightIconFilePath = path.join(this.imageDir, "member-types", 'Property_light.svg');
    protected readonly readonlyDisabledDarkIconFilePath = path.join(this.imageDir, "accessors", 'readonly_enabled_dark.svg');
    protected readonly readonlyEnabledDarkIconFilePath = path.join(this.imageDir, "accessors", 'readonly_enabled_dark.svg');
    protected readonly setterDarkIconFilePath = path.join(this.imageDir, "member-types", 'Setter_dark.svg');
    protected readonly setterLightIconFilePath = path.join(this.imageDir, "member-types", 'Setter_light.svg');
    protected readonly structureDarkIconFilePath = path.join(this.imageDir, "member-types", 'Structure_dark.svg');
    protected readonly structureLightIconFilePath = path.join(this.imageDir, "member-types", 'Structure_light.svg');

    public children: DeclarationNode[] = [];
    public end: vscode.Position = new vscode.Position(0, 0);
    public name: string | null = null;
    public parent: DeclarationNode | null = null;
    public start: vscode.Position = new vscode.Position(0, 0);

    // #endregion Properties (46)

    // #region Constructors (1)

    constructor()
    {
        super("", vscode.TreeItemCollapsibleState.Expanded);
    }

    // #endregion Constructors (1)

    // #region Protected Methods (1)

    protected convertHexToString(input: string)
    {
        var inputHex = input.match(/[\s\S]{2}/g) || [];
        var output = '';

        for (var i = 0, j = inputHex.length; i < j; i++)
        {
            output += '%' + ('0' + inputHex[i]).slice(-2);
        }

        output = decodeURIComponent(output);

        return output;
    }

    // #endregion Protected Methods (1)
}
