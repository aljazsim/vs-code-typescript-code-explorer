import * as path from "path";
import * as vscode from "vscode";

export abstract class DeclarationNode extends vscode.TreeItem
{
    // #region Properties (9)

    protected readonly imageDir = path.join(__filename, "..", "..", "..", "resources");
    protected readonly privateImage = this.convertHexToString("f09f9492");
    protected readonly protectedImage = this.convertHexToString("f09f9493");
    protected readonly abstractImage = this.convertHexToString("e29db4") + "..." + this.convertHexToString("e29db5");

    public override readonly tooltip?: string | vscode.MarkdownString | undefined;

    public children: DeclarationNode[] = [];
    public end: vscode.Position = new vscode.Position(0, 0);
    public name: string | null = null;
    public parent: DeclarationNode | null = null;
    public start: vscode.Position = new vscode.Position(0, 0);

    // #endregion Properties (9)

    // #region Constructors (1)

    constructor()
    {
        super("", vscode.TreeItemCollapsibleState.Expanded);

        this.tooltip = this.label!.toString();
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
