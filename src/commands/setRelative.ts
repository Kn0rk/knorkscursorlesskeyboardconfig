import { get } from "http";
import { addModifier, getCompositeTarget, getSimpleScopeType, replaceModifierOfTheSameType, setWhenStateUntilNextAction } from "../executeCursorlessCommand";
import { Modifier, SimpleScopeType } from "../types/PartialTargetDescriptor.types";


var offset: number = 0;
var length: number = 1;
var lastScopeType: SimpleScopeType | null = null;

type Direction = "forward" | "backward";
export function setRelative(direction: Direction) {

    var scopeType: SimpleScopeType = getSimpleScopeType();
    if (lastScopeType !== null && lastScopeType.type !== scopeType.type) {
        offset = 0;
        length = 1;        
    }

    if (direction === "forward") {
        offset = offset + 1;
    }
    else{
        offset = offset - 1;
    }
    var off=offset;
    if (offset < 0) {
        direction = "backward";
        off = -offset;
    }
    if (offset >= 0) {
        direction = "forward";
    }

    setWhenStateUntilNextAction("relative");
    
    var modifier: Modifier = {
        type: "relativeScope",
        scopeType: scopeType,
        offset: off,
        length: length,
        direction: direction,
    };
    replaceModifierOfTheSameType(modifier);
    lastScopeType = scopeType;
}

export function setLength(len: number) {
    length = len;
}

export function setOffset(off: number) {
    offset = off;
}