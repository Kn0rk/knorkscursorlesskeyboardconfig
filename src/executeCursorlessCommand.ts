import * as vscode from 'vscode';
import { ActionDescriptor, ActionType } from './types/ActionDescriptor';
import { DecoratedSymbolMark, ImplicitTargetDescriptor, Modifier, NothingMark, PartialListTargetDescriptor, PartialMark, PartialPrimitiveTargetDescriptor, PartialRangeTargetDescriptor, PartialTargetDescriptor, ScopeType, SimpleScopeType } from './types/PartialTargetDescriptor.types';




var activeModifiers: Modifier[] = [];
var activeMark: DecoratedSymbolMark | NothingMark = { type: "nothing" };

var activeRangeAnchor: PartialPrimitiveTargetDescriptor | undefined=undefined;
var activeRangeTarget: PartialRangeTargetDescriptor | undefined=undefined;
// var activeListTarget: PrimitiveDestinationDescriptor|PartialRangeTargetDescriptor[] = [];


// var currentTargets: PartialPrimitiveTargetDescriptor[] = [];
// var rangeAnchor: PartialPrimitiveTargetDescriptor | undefined;
export type TargetMode = "replace" | "range" | "list";
var targetMode: TargetMode = 'range';


function getTarget(): PartialPrimitiveTargetDescriptor {
    var mark: PartialMark = { ...activeMark};
    if (activeMark.type === "nothing") {
        mark = {type: "cursor"};
    }
    return {
        type: "primitive",
        mark: mark,
        modifiers: [...activeModifiers],
    };
}

function getRangeTarget(): PartialTargetDescriptor {
    if (activeRangeAnchor === undefined) {
     return getTarget();
    }
    return {
        type: "range",
        anchor: activeRangeAnchor,
        active: getTarget(),
        excludeAnchor: false,
        excludeActive: false,
    };
}



export function setTargetMode(mode: TargetMode) {
    activeRangeAnchor = getTarget();
    targetMode = mode;
}

function runCursorlessCommand(action: ActionDescriptor) {
    var command = {
        "version": 6,
        "usePrePhraseSnapshot": false,
        "action": action,
    };
    var commandId = "cursorless.command";
    var args = [command];
    try {
        vscode.commands.executeCommand(commandId, ...args).then(() => { });
    }
    catch (e) {
        console.log("Error running cursorless command: " + e);
    }
}

var whenStateUntilNextAction: string[] = [];
/**
 * Sets the specified when clause until the next action is performed or targets are cleared.
 * @param state The state to set.
 */
export function setWhenStateUntilNextAction(state: string) {
    vscode.commands.executeCommand("setContext", "kckc." + state, true);
    whenStateUntilNextAction = [...whenStateUntilNextAction, state];
}

var simpleScopeType: SimpleScopeType[] = [];
export function setSimpleScopeType(scopeType: SimpleScopeType) {
    simpleScopeType = [...simpleScopeType, scopeType];
}

export function getSimpleScopeType(): SimpleScopeType {
    if (simpleScopeType.length === 0) {
        return { "type": "token" };
    }
    return simpleScopeType[simpleScopeType.length - 1];
}


function highlightCurrentTargets() {


    var action: ActionDescriptor = {
        name: "private.setKeyboardTarget",
        target: {
            type: "primitive",
            mark: {
                type: "nothing",
            }
        },
    };
    runCursorlessCommand(action);
    var compositeTarget = getRangeTarget();
    var action: ActionDescriptor = {
        name: "private.setKeyboardTarget",
        target: compositeTarget,
    };
    runCursorlessCommand(action);
}



export function addTarget(target: DecoratedSymbolMark) {
    if (activeMark.type === "nothing"){
        activeMark = target;
        activeRangeAnchor = getTarget();
    }else{
        activeMark=  target;
    }
    
    highlightCurrentTargets();
}

export function clearTargets() {
    activeModifiers = [];
    activeMark = { type: "nothing" };
    activeRangeAnchor = undefined;
    targetMode = "range";
    activeRangeTarget = undefined;

    highlightCurrentTargets();
    // currentTargets = [];
    whenStateUntilNextAction.forEach(state => {
        vscode.commands.executeCommand("setContext", "kckc." + state, false);
    });
    whenStateUntilNextAction = [];
    simpleScopeType = [];

}

export function addModifier(modifier: Modifier) {
    // activeModifiers = [...activeModifiers, modifier];
    if (modifier.type === "containingScope") {
        activeModifiers = [...activeModifiers, modifier];
    }
    activeModifiers = [modifier,...activeModifiers];
    // activeModifiers.push(modifier);
    highlightCurrentTargets();
}



export function performActionOnTarget(name: ActionType, shouldClearTargets: boolean = true) {
    let returnValue: ActionDescriptor;
    var target = getRangeTarget();

    switch (name) {
        case "wrapWithPairedDelimiter":
        case "rewrapWithPairedDelimiter":
        case "insertSnippet":
        case "wrapWithSnippet":
        case "executeCommand":
        case "replace":
        case "editNew":
        case "getText":
            throw Error(`Unsupported keyboard action: ${name}`);
        case "replaceWithTarget":
        case "moveToTarget":
            returnValue = {
                name,
                source: target,
                destination: { type: "implicit" },
            };

            break;
        case "swapTargets":
            returnValue = {
                name,
                target1: target,
                target2: { type: "implicit" },
            };
            break;
        case "callAsFunction":
            returnValue = {
                name,
                callee: target,
                argument: { type: "implicit" },
            };
            break;
        case "pasteFromClipboard":
            returnValue = {
                name,
                destination: {
                    type: "primitive",
                    insertionMode: "to",
                    target: getTarget(),
                },
            };
            break;
        case "generateSnippet":
        case "highlight":
            returnValue = {
                name,
                target,
            };
            break;
        default:
            returnValue = {
                name,
                target,
            };
    }
    runCursorlessCommand(returnValue);
    if (shouldClearTargets) {
        clearTargets();
    }

}
