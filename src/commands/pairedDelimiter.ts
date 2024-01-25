import { addModifier } from "../executeCursorlessCommand";
import { ContainingSurroundingPairModifier, InteriorOnlyModifier, SurroundingPairName } from "../types/PartialTargetDescriptor.types";


export function targetPairedDelimiter(
    keySequence: string
  ){
    const scopeType: SurroundingPairName = keySequence as SurroundingPairName;
  
    const scope: ContainingSurroundingPairModifier = {
      type: "containingScope",
      scopeType: {
        type: "surroundingPair",
      delimiter: scopeType,
      requireStrongContainment: false,
    },
  };
  const interiorOnly: InteriorOnlyModifier = {
    type: "interiorOnly",
    };
    addModifier(scope);
    addModifier(interiorOnly);
  }
  