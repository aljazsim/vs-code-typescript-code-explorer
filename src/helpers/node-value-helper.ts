import { AccessorDeclarationNode } from "../Nodes/AccessorDeclarationNode";
import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { ConstDeclarationNode } from "../Nodes/ConstDeclarationNode";
import { ConstructorDeclarationNode } from "../Nodes/ConstructorDeclarationNode";
import { DeclarationNode } from "../Nodes/DeclarationNode";
import { DescriptionNode } from "../Nodes/DescriptionNode";
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

// #region Functions (5)

export function getAccessor(node: DeclarationNode)
{
    if (node instanceof InterfaceDeclarationNode ||
        node instanceof TypeAliasDeclarationNode ||
        node instanceof ClassDeclarationNode ||
        node instanceof FunctionDeclarationNode ||
        node instanceof VariableDeclarationNode)
    {
        if (node.isExport)
        {
            return "exported";
        }
        else
        {
            return "not exported";
        }
    }
    else if (node instanceof PropertyDeclarationNode ||
        node instanceof AccessorDeclarationNode ||
        node instanceof SetterDeclarationNode ||
        node instanceof GetterDeclarationNode ||
        node instanceof MethodDeclarationNode)
    {
        return node.accessModifier;
    }

    return "";
}

export function getAccessorOrder(node: DeclarationNode)
{
    if (node instanceof InterfaceDeclarationNode ||
        node instanceof TypeAliasDeclarationNode ||
        node instanceof ClassDeclarationNode ||
        node instanceof FunctionDeclarationNode ||
        node instanceof VariableDeclarationNode)
    {
        if (node.isExport)
        {
            return "102";
        }
        else
        {
            return "101";
        }
    }
    else if (node instanceof PropertyDeclarationNode ||
        node instanceof AccessorDeclarationNode ||
        node instanceof SetterDeclarationNode ||
        node instanceof GetterDeclarationNode ||
        node instanceof MethodDeclarationNode)
    {
        if (node.accessModifier === "private")
        {
            return "201";
        }
        else if (node.accessModifier === "protected")
        {
            return "202";
        }
        else if (node.accessModifier === "public")
        {
            return "203";
        }
    }

    return "";
}

export function getName(node: DeclarationNode)
{
    return node.name.toLowerCase();
}

export function getType(node: DeclarationNode)
{
    // module member types
    if (node instanceof EnumDeclarationNode)
    {
        return "enum";
    }
    if (node instanceof InterfaceDeclarationNode)
    {
        return "interface";
    }
    else if (node instanceof ClassDeclarationNode)
    {
        return "class";
    }
    else if (node instanceof TypeAliasDeclarationNode)
    {
        return "type";
    }
    else if (node instanceof VariableDeclarationNode)
    {
        return "variable";
    }
    else if (node instanceof FunctionDeclarationNode)
    {
        return "export function";
    }

    // interface / type alias member types
    if (node instanceof PropertySignatureDeclarationNode)
    {
        return "property";
    }
    else if (node instanceof IndexSignatureDeclarationNode)
    {
        return "index";
    }
    else if (node instanceof MethodSignatureDeclarationNode)
    {
        return "method";
    }

    // enum member types
    if (node instanceof EnumMemberDeclarationNode)
    {
        return "enum value";
    }

    // class member types
    if (node instanceof ConstDeclarationNode)
    {
        return "constant";
    }
    if (node instanceof PropertyDeclarationNode)
    {
        return "property";
    }
    else if (node instanceof ConstructorDeclarationNode ||
        node instanceof StaticCodeBlockDeclarationNode)
    {
        return "constructor";
    }
    else if (node instanceof AccessorDeclarationNode)
    {
        return "accessor";
    }
    else if (node instanceof GetterDeclarationNode)
    {
        return "getter";
    }
    else if (node instanceof SetterDeclarationNode)
    {
        return "setter";
    }
    else if (node instanceof MethodDeclarationNode)
    {
        return "method";
    }

    // empty
    if (node instanceof EmptyDeclarationNode)
    {
        return "";
    }

    return "-";
}

export function getTypeOrder(node?: DeclarationNode)
{
    // module member types
    if (node instanceof EnumDeclarationNode || (node instanceof DescriptionNode && node.name === "enum"))
    {
        return "101";
    }
    if (node instanceof InterfaceDeclarationNode || (node instanceof DescriptionNode && node.name === "interface"))
    {
        return "102";
    }
    else if (node instanceof ClassDeclarationNode || (node instanceof DescriptionNode && node.name === "class"))
    {
        return "103";
    }
    else if (node instanceof TypeAliasDeclarationNode || (node instanceof DescriptionNode && node.name === "type"))
    {
        return "104";
    }
    else if (node instanceof VariableDeclarationNode || (node instanceof DescriptionNode && node.name === "variable"))
    {
        return "105";
    }
    else if (node instanceof FunctionDeclarationNode || (node instanceof DescriptionNode && node.name === "export function"))
    {
        return "106";
    }

    // enum member types
    if (node instanceof EnumMemberDeclarationNode || (node instanceof DescriptionNode && node.name === "enum values"))
    {
        return "301";
    }

    // interface/type/class member types
    if (node instanceof ConstDeclarationNode || (node instanceof DescriptionNode && node.name === "constant"))
    {
        return "401";
    }
    if (node instanceof PropertyDeclarationNode || (node instanceof DescriptionNode && node.name === "property"))
    {
        return "401";
    }
    else if (node instanceof ConstructorDeclarationNode || (node instanceof DescriptionNode && node.name === "constructor"))
    {
        return "402";
    }
    else if (node instanceof StaticCodeBlockDeclarationNode || (node instanceof DescriptionNode && node.name === "static constructor"))
    {
        return "403";
    }
    else if (node instanceof IndexSignatureDeclarationNode || (node instanceof DescriptionNode && node.name === "index"))
    {
        return "404";
    }
    else if (node instanceof AccessorDeclarationNode || (node instanceof DescriptionNode && node.name === "accessor"))
    {
        return "405";
    }
    else if (node instanceof GetterDeclarationNode || (node instanceof DescriptionNode && node.name === "getter"))
    {
        return "406";
    }
    else if (node instanceof SetterDeclarationNode || (node instanceof DescriptionNode && node.name === "setter"))
    {
        return "407";
    }
    else if (node instanceof MethodDeclarationNode || (node instanceof DescriptionNode && node.name === "method"))
    {
        return "408";
    }

    return "601";
}

// #endregion Functions (5)
