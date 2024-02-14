import { addModifier,  getSimpleScopeType, setWhenStateUntilNextAction } from "../executeCursorlessCommand";
import { Modifier, SimpleScopeType, SimpleScopeTypeType } from "../types/PartialTargetDescriptor.types";



type Direction = "forward" | "backward";
export function setRelative(args:any[]) {
    var direction: Direction = args[0];
    var scopeType: SimpleScopeTypeType = args[1];


    var off = 1;

    setWhenStateUntilNextAction("relative");
    
    var modifier: Modifier = {
        type: "relativeScope",
        scopeType: {
            type:scopeType
        },
        offset: off,
        length: 1,
        direction: direction,
    };
    // replaceModifierOfTheSameType(modifier);
    addModifier(modifier);
}
