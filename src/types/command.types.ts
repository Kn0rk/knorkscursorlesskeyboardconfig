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

import { CommandV6 } from "./CommandV6.types";
// import type { CommandV0, CommandV1 } from "./legacy/CommandV0V1.types";
// import type { CommandV2 } from "./legacy/CommandV2.types";
// import type { CommandV3 } from "./legacy/CommandV3.types";
// import type { CommandV4 } from "./legacy/CommandV4.types";
// import type { CommandV5 } from "./legacy/CommandV5.types";

export type CommandComplete = Required<Omit<CommandLatest, "spokenForm">> &
  Pick<CommandLatest, "spokenForm">;
export const LATEST_VERSION = 6 as const;

export type CommandLatest = Command & {
  version: typeof LATEST_VERSION;
};

export type Command =
  // | CommandV0
  // | CommandV1
  // | CommandV2
  // | CommandV3
  // | CommandV4
  // | CommandV5
   CommandV6;
