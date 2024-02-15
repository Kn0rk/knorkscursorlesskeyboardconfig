
import { addModifier } from "../executeCursorlessCommand";
import { Modifier } from "../types/PartialTargetDescriptor.types";
import { setTargetScope } from "./setScope";


export function setEnd() {

    // setTargetScope("line");

    let modifier: Modifier = {
        type: "endOf",
    };
    // setTargetScope("line");
    addModifier(modifier);
}



export function setStart() {

    // setTargetScope("line");

    let modifier: Modifier = {
        type: "startOf",
    };
    // setTargetScope("line");
    addModifier(modifier);
}