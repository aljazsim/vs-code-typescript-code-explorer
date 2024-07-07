import { AccessorDeclarationNode } from "../Nodes/AccessorDeclarationNode";
import { ClassDeclarationNode } from "../Nodes/ClassDeclarationNode";
import { ReadonlyPropertyDeclarationNode } from "../Nodes/ReadonlyPropertyDeclarationNode";
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
import { ConstVariableDeclarationNode } from "../Nodes/ConstVariableDeclarationNode";
import { ReadonlyPropertySignatureDeclarationNode } from "../Nodes/ReadonlyPropertySignatureDeclarationNode";

// #region Functions (5)

export function getAccessor(node: DeclarationNode)
{
    if (node instanceof InterfaceDeclarationNode ||
        node instanceof TypeAliasDeclarationNode ||
        node instanceof ClassDeclarationNode ||
        node instanceof FunctionDeclarationNode ||
        node instanceof VariableDeclarationNode ||
        node instanceof ConstVariableDeclarationNode)
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
    else if (node instanceof ReadonlyPropertyDeclarationNode ||
        node instanceof PropertyDeclarationNode ||
        node instanceof AccessorDeclarationNode ||
        node instanceof SetterDeclarationNode ||
        node instanceof GetterDeclarationNode ||
        node instanceof MethodDeclarationNode)
    {
        return node.accessModifier;
    }
    else if (node instanceof DescriptionNode)
    {
        return node.name;
    }

    return "";
}

export function getAccessorOrder(node: DeclarationNode)
{
    if (node instanceof InterfaceDeclarationNode ||
        node instanceof TypeAliasDeclarationNode ||
        node instanceof ClassDeclarationNode ||
        node instanceof FunctionDeclarationNode ||
        node instanceof VariableDeclarationNode ||
        node instanceof ConstVariableDeclarationNode)
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
    else if (node instanceof ReadonlyPropertyDeclarationNode ||
        node instanceof PropertyDeclarationNode ||
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
    else if (node instanceof DescriptionNode)
    {
        if (node.name === "exported")
        {
            return "102";
        }
        else if (node.name === "not exported")
        {
            return "101";
        }
        else if (node.name === "private")
        {
            return "201";
        }
        else if (node.name === "protected")
        {
            return "202";
        }
        else if (node.name === "public")
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
    else if (node instanceof ConstVariableDeclarationNode)
    {
        return "const variable";
    }
    else if (node instanceof ConstVariableDeclarationNode)
    {
        return "const variable";
    }
    else if (node instanceof FunctionDeclarationNode)
    {
        return "function";
    }

    // interface / type alias member types
    if (node instanceof ReadonlyPropertySignatureDeclarationNode)
    {
        return "readonly property";
    }
    else if (node instanceof PropertySignatureDeclarationNode)
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
    if (node instanceof ReadonlyPropertyDeclarationNode)
    {
        return "readonly property";
    }
    else if (node instanceof PropertyDeclarationNode)
    {
        return "property";
    }
    else if (node instanceof ReadonlyPropertyDeclarationNode)
    {
        return "readonly property";
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
    else if (node instanceof ConstVariableDeclarationNode || (node instanceof DescriptionNode && node.name === "const variable"))
    {
        return "105";
    }
    else if (node instanceof VariableDeclarationNode || (node instanceof DescriptionNode && node.name === "variable"))
    {
        return "106";
    }
    else if (node instanceof FunctionDeclarationNode || (node instanceof DescriptionNode && node.name === "function"))
    {
        return "107";
    }

    // enum member types
    if (node instanceof EnumMemberDeclarationNode || (node instanceof DescriptionNode && node.name === "enum values"))
    {
        return "301";
    }

    // class member types
    if (node instanceof ReadonlyPropertyDeclarationNode || node instanceof ReadonlyPropertySignatureDeclarationNode || (node instanceof DescriptionNode && node.name === "readonly property"))
    {
        return "401";
    }
    else if (node instanceof PropertyDeclarationNode || node instanceof PropertySignatureDeclarationNode || (node instanceof DescriptionNode && node.name === "property"))
    {
        return "402";
    }
    else if (node instanceof ConstructorDeclarationNode || (node instanceof DescriptionNode && node.name === "constructor"))
    {
        return "403";
    }
    else if (node instanceof StaticCodeBlockDeclarationNode || (node instanceof DescriptionNode && node.name === "static constructor"))
    {
        return "404";
    }
    else if (node instanceof IndexSignatureDeclarationNode || node instanceof IndexSignatureDeclarationNode || (node instanceof DescriptionNode && node.name === "index"))
    {
        return "405";
    }
    else if (node instanceof AccessorDeclarationNode || (node instanceof DescriptionNode && node.name === "accessor"))
    {
        return "406";
    }
    else if (node instanceof GetterDeclarationNode || (node instanceof DescriptionNode && node.name === "getter"))
    {
        return "407";
    }
    else if (node instanceof SetterDeclarationNode || (node instanceof DescriptionNode && node.name === "setter"))
    {
        return "408";
    }
    else if (node instanceof MethodDeclarationNode || node instanceof MethodSignatureDeclarationNode || (node instanceof DescriptionNode && node.name === "method"))
    {
        return "409";
    }

    return "601";
}

// #endregion Functions (5)
