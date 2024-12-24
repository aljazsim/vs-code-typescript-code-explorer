import { NodeAccessModifier } from "../enums/NodeAccessModifier";
import { NodeCaption } from "../enums/NodeCaption";
import { AccessorDeclarationNode } from "../nodes/AccessorDeclarationNode";
import { ClassDeclarationNode } from "../nodes/ClassDeclarationNode";
import { ConstructorDeclarationNode } from "../nodes/ConstructorDeclarationNode";
import { ConstVariableDeclarationNode } from "../nodes/ConstVariableDeclarationNode";
import { DeclarationNode } from "../nodes/DeclarationNode";
import { DescriptionNode } from "../nodes/DescriptionNode";
import { EmptyNode } from "../nodes/EmptyNode";
import { EnumDeclarationNode } from "../nodes/EnumDeclarationNode";
import { EnumMemberDeclarationNode } from "../nodes/EnumMemberDeclarationNode";
import { FunctionDeclarationNode } from "../nodes/FunctionDeclarationNode";
import { GetterDeclarationNode } from "../nodes/GetterDeclarationNode";
import { IndexSignatureDeclarationNode } from "../nodes/IndexSignatureDeclarationNode";
import { InterfaceDeclarationNode } from "../nodes/InterfaceDeclarationNode";
import { MethodDeclarationNode } from "../nodes/MethodDeclarationNode";
import { MethodSignatureDeclarationNode } from "../nodes/MethodSignatureDeclarationNode";
import { Node } from "../nodes/Node";
import { PropertyDeclarationNode } from "../nodes/PropertyDeclarationNode";
import { PropertySignatureDeclarationNode } from "../nodes/PropertySignatureDeclarationNode";
import { ReadonlyPropertyDeclarationNode } from "../nodes/ReadonlyPropertyDeclarationNode";
import { ReadonlyPropertySignatureDeclarationNode } from "../nodes/ReadonlyPropertySignatureDeclarationNode";
import { SetterDeclarationNode } from "../nodes/SetterDeclarationNode";
import { StaticCodeBlockDeclarationNode } from "../nodes/StaticCodeBlockDeclarationNode";
import { TypeAliasDeclarationNode } from "../nodes/TypeAliasDeclarationNode";
import { VariableDeclarationNode } from "../nodes/VariableDeclarationNode";

// #region Functions (7)

export function getAccessor(node: Node)
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
            return NodeCaption.exported;
        }
        else
        {
            return NodeCaption.notExported;
        }
    }
    else if (node instanceof ReadonlyPropertyDeclarationNode ||
        node instanceof PropertyDeclarationNode ||
        node instanceof AccessorDeclarationNode ||
        node instanceof SetterDeclarationNode ||
        node instanceof GetterDeclarationNode ||
        node instanceof MethodDeclarationNode)
    {
        return NodeAccessModifier[node.accessModifier];
    }
    else if (node instanceof DescriptionNode)
    {
        return node.description as string;
    }

    return "";
}

export function getAccessorOrder(node: Node)
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
        if (node.accessModifier === NodeAccessModifier.private)
        {
            return "201";
        }
        else if (node.accessModifier === NodeAccessModifier.protected)
        {
            return "202";
        }
        else if (node.accessModifier === NodeAccessModifier.public)
        {
            return "203";
        }
    }
    else if (node instanceof DescriptionNode)
    {
        if (node.description === NodeCaption.exported)
        {
            return "102";
        }
        else if (node.description === NodeCaption.notExported)
        {
            return "101";
        }
        else if (node.description === NodeCaption.private)
        {
            return "201";
        }
        else if (node.description === NodeCaption.protected)
        {
            return "202";
        }
        else if (node.description === NodeCaption.public)
        {
            return "203";
        }
    }

    return "999";
}

export function getMemberType(node: Node)
{
    // interface / type alias member types
    if (node instanceof ReadonlyPropertySignatureDeclarationNode)
    {
        return NodeCaption.readonlyProperty;
    }
    else if (node instanceof PropertySignatureDeclarationNode)
    {
        return NodeCaption.property;
    }
    else if (node instanceof IndexSignatureDeclarationNode)
    {
        return NodeCaption.index;
    }
    else if (node instanceof MethodSignatureDeclarationNode)
    {
        return NodeCaption.method;
    }

    // class member types
    if (node instanceof ReadonlyPropertyDeclarationNode)
    {
        return NodeCaption.readonlyProperty;
    }
    else if (node instanceof PropertyDeclarationNode)
    {
        return NodeCaption.property;
    }
    else if (node instanceof ReadonlyPropertyDeclarationNode)
    {
        return NodeCaption.readonlyProperty;
    }
    else if (node instanceof ConstructorDeclarationNode ||
        node instanceof StaticCodeBlockDeclarationNode)
    {
        return NodeCaption.constructor;
    }
    else if (node instanceof AccessorDeclarationNode)
    {
        return NodeCaption.accessor;
    }
    else if (node instanceof GetterDeclarationNode)
    {
        return NodeCaption.getter;
    }
    else if (node instanceof SetterDeclarationNode)
    {
        return NodeCaption.setter;
    }
    else if (node instanceof MethodDeclarationNode)
    {
        return NodeCaption.method;
    }

    // enum member types
    if (node instanceof EnumMemberDeclarationNode)
    {
        return NodeCaption.enumValue;
    }

    // empty
    if (node instanceof EmptyNode)
    {
        return "";
    }

    return "-";
}

export function getName(node: Node)
{
    if (node instanceof DeclarationNode)
    {
        return node.name.toLowerCase();
    }
    else if (node instanceof DescriptionNode)
    {
        return node.description as string;
    }
    else if (node instanceof EmptyNode)
    {
        return node.description as string;
    }
    else
    {
        return node.label as string ?? "";
    }
}

export function getType(node: Node)
{
    // module member types
    if (node instanceof EnumDeclarationNode)
    {
        return NodeCaption.enum;
    }
    if (node instanceof InterfaceDeclarationNode)
    {
        return NodeCaption.interface;
    }
    else if (node instanceof ClassDeclarationNode)
    {
        return NodeCaption.class;
    }
    else if (node instanceof TypeAliasDeclarationNode)
    {
        return NodeCaption.type;
    }
    else if (node instanceof VariableDeclarationNode)
    {
        return NodeCaption.variable;
    }
    else if (node instanceof ConstVariableDeclarationNode)
    {
        return NodeCaption.constVariable;
    }
    else if (node instanceof FunctionDeclarationNode)
    {
        return NodeCaption.function;
    }

    // empty
    if (node instanceof EmptyNode)
    {
        return "";
    }

    return "-";
}

export function getTypeMemberOrder(node?: Node)
{
    // class/interface/type member types
    if (node instanceof ReadonlyPropertyDeclarationNode || node instanceof ReadonlyPropertySignatureDeclarationNode || (node instanceof DescriptionNode && (node.description === NodeCaption.readonlyProperty)))
    {
        return "101";
    }
    else if (node instanceof PropertyDeclarationNode || node instanceof PropertySignatureDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.property))
    {
        return "102";
    }
    else if (node instanceof ConstructorDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.constructor))
    {
        return "103";
    }
    else if (node instanceof StaticCodeBlockDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.staticConstructor))
    {
        return "104";
    }
    else if (node instanceof IndexSignatureDeclarationNode || node instanceof IndexSignatureDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.index))
    {
        return "105";
    }
    else if (node instanceof AccessorDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.accessor))
    {
        return "106";
    }
    else if (node instanceof GetterDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.getter))
    {
        return "107";
    }
    else if (node instanceof SetterDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.setter))
    {
        return "108";
    }
    else if (node instanceof MethodDeclarationNode || node instanceof MethodSignatureDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.method))
    {
        return "109";
    }

    // enum member types
    if (node instanceof EnumMemberDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.enumValue))
    {
        return "201";
    }

    return "999";
}

export function getTypeOrder(node?: Node)
{
    // module member types
    if (node instanceof EnumDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.enum))
    {
        return "101";
    }
    else if (node instanceof InterfaceDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.interface))
    {
        return "102";
    }
    else if (node instanceof ClassDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.class))
    {
        return "103";
    }
    else if (node instanceof TypeAliasDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.type))
    {
        return "104";
    }
    else if (node instanceof ConstVariableDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.constVariable))
    {
        return "105";
    }
    else if (node instanceof VariableDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.variable))
    {
        return "106";
    }
    else if (node instanceof FunctionDeclarationNode || (node instanceof DescriptionNode && node.description === NodeCaption.function))
    {
        return "107";
    }

    return "999";
}

// #endregion Functions (7)
