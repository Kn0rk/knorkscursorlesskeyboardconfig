import { addModifier, setSimpleScopeType } from "../executeCursorlessCommand";
import { ContainingScopeModifier, SimpleScopeType, SimpleScopeTypeType } from "../types/PartialTargetDescriptor.types";

export const SimpleScopeTypeArray = [
    "argumentOrParameter",
    "anonymousFunction",
    "attribute",
    "branch",
    "class",
    "className",
    "collectionItem",
    "collectionKey",
    "comment",
    "functionCall",
    "functionCallee",
    "functionName",
    "ifStatement",
    "instance",
    "list",
    "map",
    "name",
    "namedFunction",
    "regularExpression",
    "statement",
    "string",
    "type",
    "value",
    "condition",
    "section",
    "sectionLevelOne",
    "sectionLevelTwo",
    "sectionLevelThree",
    "sectionLevelFour",
    "sectionLevelFive",
    "sectionLevelSix",
    "selector",
    "switchStatementSubject",
    "unit",
    "xmlBothTags",
    "xmlElement",
    "xmlEndTag",
    "xmlStartTag",
    "notebookCell",
    // Latex scope types
    "part",
    "chapter",
    "subSection",
    "subSubSection",
    "namedParagraph",
    "subParagraph",
    "environment",
    // Text based scopes
    "character",
    "word",
    "token",
    "identifier",
    "line",
    "sentence",
    "paragraph",
    "document",
    "nonWhitespaceSequence",
    "boundedNonWhitespaceSequence",
    "url",
    // Talon
    "command",
    "interiorOnly",
    "excludeInterior",
] as const;

export type ScopeType = typeof SimpleScopeTypeArray[number];

export function setTargetScope(
    keySequence: ScopeType
) {
    if (!SimpleScopeTypeArray.includes(keySequence as any)) {
        throw Error(`Unsupported scope: ${keySequence}`);
    }
    const scopeType: SimpleScopeTypeType = keySequence as SimpleScopeTypeType;
    const scope: SimpleScopeType = {
        type: scopeType,
    };
    
    const scopeMod: ContainingScopeModifier = {
        type: "containingScope",
        scopeType: scope
    };
    setSimpleScopeType(scope);
    addModifier(scopeMod);
}
