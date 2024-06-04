import { AccessorDeclarationNode } from "../Nodes/AccessorDeclarationNode";
import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { ConstDeclarationNode } from "../Nodes/ConstDeclarationNode";
import { ConstructorDeclarationNode } from "../Nodes/ConstructorDeclarationNode";
import { DeclarationNode } from "../Nodes/DeclarationNode";
import { EmptyDeclarationNode } from "../Nodes/EmptyDeclarationNode";
import { EnumDeclarationNode } from "../Nodes/EnumDeclarationNode";
import { EnumMemberDeclarationNode } from "../Nodes/EnumMemberDeclarationNode";
import { FunctionDeclarationNode } from "../Nodes/FunctionDeclarationNode";
import { GetterDeclarationNode } from "../Nodes/GetterDeclarationNode";
import { IndexSignatureDeclarationNode } from "../Nodes/IndexSignatureDeclarationNode";
import { InterfaceDeclarationNode } from "../Nodes/InterfaceDeclarationNode";
import { MethodDeclarationNode } from "../Nodes/MethodDeclarationNode";
import { MethodSignatureDeclarationNode } from "../Nodes/MethodSignatureDeclarationNode";
import { PropertyDeclarationNode } from "../Nodes/PropertyDeclarationNode";
import { PropertySignatureDeclarationNode } from "../Nodes/PropertySignatureDeclarationNode";
import { SetterDeclarationNode } from "../Nodes/SetterDeclarationNode";
import { StaticCodeBlockDeclarationNode } from "../Nodes/StaticCodeBlockDeclarationNode";
import { TypeAliasDeclarationNode } from "../Nodes/TypeAliasDeclarationNode";
import { VariableDeclarationNode } from "../Nodes/VariableDeclarationNode";

// #region Functions (2)

export function compareNodes(a: DeclarationNode, b: DeclarationNode, orderBy: (node: DeclarationNode) => number)
{
    let valueA = orderBy(a);
    let valueB = orderBy(b);

    if (valueA > valueB)
    {
        return 1;
    }
    else if (valueA < valueB)
    {
        return -1;
    }
    else
    {
        if (a.label!.toString().toLowerCase() > b.label!.toString().toLowerCase())
        {
            return 1;
        }
        else if (a.label!.toString().toLowerCase() < b.label!.toString().toLowerCase())
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
}

export function orderByNodeType(declarationNode: DeclarationNode)
{
    // module member types
    if (declarationNode instanceof EnumDeclarationNode)
    {
        return 101;
    }
    if (declarationNode instanceof InterfaceDeclarationNode)
    {
        return 102;
    }
    else if (declarationNode instanceof ClassDeclarationNode)
    {
        return 103;
    }
    else if (declarationNode instanceof TypeAliasDeclarationNode)
    {
        return 104;
    }
    else if (declarationNode instanceof VariableDeclarationNode)
    {
        return 105;
    }
    else if (declarationNode instanceof FunctionDeclarationNode)
    {
        return 106;
    }

    // interface / type alias member types
    if (declarationNode instanceof PropertySignatureDeclarationNode)
    {
        return 201;
    }
    else if (declarationNode instanceof IndexSignatureDeclarationNode)
    {
        return 202;
    }
    else if (declarationNode instanceof MethodSignatureDeclarationNode)
    {
        return 203;
    }

    // enum member types
    if (declarationNode instanceof EnumMemberDeclarationNode)
    {
        return 301;
    }

    // class member types
    if (declarationNode instanceof ConstDeclarationNode)
    {
        return 401;
    }
    if (declarationNode instanceof PropertyDeclarationNode)
    {
        return 401;
    }
    else if (declarationNode instanceof ConstructorDeclarationNode)
    {
        return 402;
    }
    else if (declarationNode instanceof StaticCodeBlockDeclarationNode)
    {
        return 403;
    }
    else if (declarationNode instanceof AccessorDeclarationNode)
    {
        return 404;
    }
    else if (declarationNode instanceof GetterDeclarationNode)
    {
        return 405;
    }
    else if (declarationNode instanceof SetterDeclarationNode)
    {
        return 406;
    }
    else if (declarationNode instanceof MethodDeclarationNode)
    {
        return 407;
    }

    // empty
    if (declarationNode instanceof EmptyDeclarationNode)
    {
        return 501;
    }

    return 601;
}

// #endregion Functions (2)
