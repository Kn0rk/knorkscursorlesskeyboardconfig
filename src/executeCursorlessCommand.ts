import * as vscode from 'vscode';
import { ActionDescriptor, ActionType } from './types/ActionDescriptor';
import { Modifier, PartialPrimitiveTargetDescriptor, PartialTargetDescriptor, ScopeType, SimpleScopeType } from './types/PartialTargetDescriptor.types';
import { setLength, setOffset } from './commands/setRelative';

var currentTargets: PartialPrimitiveTargetDescriptor[] = [];
var rangeAnchor: PartialPrimitiveTargetDescriptor | undefined;
export type TargetMode = "replace" | "range" | "list";
var targetMode: TargetMode = 'replace';

export function setTargetMode(mode: TargetMode) {
    rangeAnchor = currentTargets[currentTargets.length - 1];
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
    vscode.commands.executeCommand(commandId, ...args).then(() => { });
}

function getTargetsWithImplicitTarget(): PartialPrimitiveTargetDescriptor[] {
    var ret: PartialPrimitiveTargetDescriptor[] = [];
    if (currentTargets.length === 0) {
        ret.push({
            type: "primitive",
            mark: {
                type: "cursor",
            }
        });
    }
    else {
        ret = currentTargets;
    }
    return ret;
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


export function getCompositeTarget(): PartialTargetDescriptor {

    if (currentTargets.length === 0) {
        currentTargets.push({
            type: "primitive",
            mark: {
                type: "cursor",
            }
        });
    }

    if (currentTargets.length === 1 && targetMode !== "replace") {
        currentTargets.unshift({
            type: "primitive",
            mark: {
                type: "cursor",
            }
        });
    }
    var compositeTarget: PartialTargetDescriptor;

    switch (targetMode) {
        case "replace": {
            compositeTarget = currentTargets[currentTargets.length - 1];
            break;
        }
        case "range": {
            compositeTarget = {
                type: "range",
                anchor: rangeAnchor!,
                active: currentTargets[currentTargets.length - 1],
                excludeAnchor: false,
                excludeActive: false,
            };
            break;
        }
        case "list": {
            compositeTarget = {
                type: "list",
                elements: currentTargets,
            };
            break;
        }
    }
    return compositeTarget;
}
function highlightCurrentTargets() {


    var action: ActionDescriptor = {
        name: "highlight",
        target: {
            type: "primitive",
            mark: {
                type: "nothing",
            }
        },
    };
    runCursorlessCommand(action);
    var compositeTarget = getCompositeTarget();
    var action: ActionDescriptor = {
        name: "highlight",
        target: compositeTarget,
    };
    runCursorlessCommand(action);
}



export function addTarget(target: PartialPrimitiveTargetDescriptor) {
    currentTargets = [...currentTargets, target];
    highlightCurrentTargets();
}

export function clearTargets() {
    currentTargets = [
        {
            type: "primitive",
            mark: {
                type: "nothing",
            },
        },
    ];
    targetMode = "replace";
    highlightCurrentTargets();
    currentTargets = [];
    whenStateUntilNextAction.forEach(state => {
        vscode.commands.executeCommand("setContext", "kckc." + state, false);
    });
    whenStateUntilNextAction = [];
    simpleScopeType = [];
    setLength(1);
    setOffset(0);
}

export function addModifier(modifier: Modifier) {
    const modifiedTargets = [];
    var allTargets = getTargetsWithImplicitTarget();
    for (let curTarget of allTargets) {
        if (curTarget === undefined) {
            return;
        }
        const mods: Modifier[] = [modifier]
        if (curTarget.modifiers) {
            mods.push(...curTarget.modifiers)
        }
        curTarget = {
            type: curTarget.type,
            modifiers: mods,
            mark: curTarget.mark,
        };
        modifiedTargets.push(curTarget);
    }
    currentTargets = modifiedTargets;
    highlightCurrentTargets();
}

export function replaceModifierOfTheSameType(modifier: Modifier) {
    const modifiedTargets = [];
    var allTargets = getTargetsWithImplicitTarget();
    for (let curTarget of allTargets) {
        if (curTarget === undefined) {
            continue;
        }
        // const mods:Modifier[]=curTarget.modifiers?.filter(mod=>mod.type===modifier.type)??[];
        const curMods = curTarget.modifiers ?? [];

        if (curMods.length > 0 && curMods[curMods.length - 1].type === modifier.type) {
            // remove the old modifier
            const modsDifferentType: Modifier[] = curTarget.modifiers?.filter(mod => mod.type !== modifier.type) ?? [];
            modifiedTargets.push({
                type: curTarget.type,
                modifiers: [...modsDifferentType, modifier],
                mark: curTarget.mark,
            });
        }
        else { // no modifier of the same type so just add it
            modifiedTargets.push({
                type: curTarget.type,
                modifiers: [...curMods, modifier],
                mark: curTarget.mark,
            });
        }

    }
    currentTargets = modifiedTargets;
    highlightCurrentTargets();
}


export function performActionOnTarget(name: ActionType, shouldClearTargets: boolean = true) {
    let returnValue: ActionDescriptor;
    var target = getCompositeTarget();

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
                    target: getTargetsWithImplicitTarget()[getTargetsWithImplicitTarget().length - 1],
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
