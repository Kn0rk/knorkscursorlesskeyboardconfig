// MIT License

// Copyright (c) 2021 Brandon Virgil Rule

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// copied from https://github.com/cursorless-dev/cursorless

import {
  PartialListTargetDescriptor,
  PartialPrimitiveTargetDescriptor,
  PartialRangeTargetDescriptor,
} from "./PartialTargetDescriptor.types";

/**
 * The insertion mode to use when inserting relative to a target.
 * - `before` inserts before the target.  Depending on the target, a delimiter
 *   may be inserted after the inserted text.
 * - `after` inserts after the target.  Depending on the target, a delimiter may
 *   be inserted before the inserted text.
 * - `to` replaces the target.  However, this insertion mode may also be used
 *   when the target is really only a pseudo-target.  For example, you could say
 *   `"bring type air to bat"` even if `bat` doesn't already have a type.  In
 *   that case, `"take type bat"` wouldn't work, so `"type bat"` is really just
 *   a pseudo-target in that situation.
 */
export type InsertionMode = "before" | "after" | "to";

export interface PrimitiveDestinationDescriptor {
  type: "primitive";

  /**
   * The insertion mode to use when inserting relative to {@link target}.
   */
  insertionMode: InsertionMode;

  target:
    | PartialPrimitiveTargetDescriptor
    | PartialRangeTargetDescriptor
    | PartialListTargetDescriptor;
}

/**
 * A list of destinations.  This is used when the user uses more than one insertion mode
 * in a single command.  For example, `"bring air after bat and before cap"`.
 */
export interface ListDestinationDescriptor {
  type: "list";
  destinations: PrimitiveDestinationDescriptor[];
}

/**
 * An implicit destination.  This is used for e.g. `"bring air"` (note the user
 * doesn't explicitly specify the destination), or `"snip funk"`.
 */
export interface ImplicitDestinationDescriptor {
  type: "implicit";
}

export type DestinationDescriptor =
  | ListDestinationDescriptor
  | PrimitiveDestinationDescriptor
  | ImplicitDestinationDescriptor;
