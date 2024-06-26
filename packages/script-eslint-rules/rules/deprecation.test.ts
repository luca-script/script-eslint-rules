import rule from "./deprecation";
import { createRuleTester } from "../util/test-utils";

const ruleTester = createRuleTester();

ruleTester.run("deprecation", rule, {
    valid: [
        `
declare const b: string;
if (false as boolean) {
  /**
   * @deprecated
   */
  const b = '';
}

const a = b;
        `.trim(),
        `
const a = 'a';
        `.trim(),
        `
/**
 * @deprecated
 */
const a = 'a';
        `.trim(),
        `
/**
 * @deprecated
 */
class A {}
        `.trim(),
        `
/**
 * @deprecated
 */
interface A {}
        `.trim(),
        `
/**
 * @deprecated
 */
declare class A {}
        `.trim(),
        `
class A {
  /**
   * @deprecated
   */
  b: string;
}
        `.trim(),
        `
declare class A {
  /**
   * @deprecated
   */
  b: string;
}
        `.trim(),
        `
interface A {
  /**
   * @deprecated
   */
  b: string;
}
        `.trim(),
        `
class A {
  /**
   * @deprecated
   */
  b: string;
}

class B extends A {
  b: string;
}
        `.trim(),
        `
/** @deprecated */
declare function a(val: string): string;
declare function a(val: number): number;
        `.trim(),
        `
/** @deprecated */
declare function a(val: string): string;
declare function a(val: number): number;

a(2);
        `.trim(),
        `
/** @deprecated */
declare function a<K extends string>(val: K): K;
declare function a(val: number): number;
declare function a(val: boolean): boolean;

a(2);
        `.trim(),
        `
namespace JSX {
    export interface IntrinsicElements {
        /** @deprecated */
        Example: {}
    }
    export type ElementType = any;
}

declare const Example: (a: any) => any; 

console.log(<Example></Example>)
        `.trim(),
    ],
    invalid: [
        {
            code: `
/**
 * @deprecated EXAMPLE
 */
const a = 'a';

console.log(a);
      `.trim(),
            errors: [
                {
                    messageId: "deprecatedWithReason",
                    data: {
                        name: "a",
                        reason: "EXAMPLE",
                    },
                    line: 6,
                },
            ],
        },
        {
            code: `
const a = {
  /**
   * @deprecated
   */
  b: 'Hi!',
};

const c = a.b;
      `.trim(),
            errors: [
                {
                    messageId: "deprecated",
                    line: 8,
                    data: {
                        name: "b",
                    },
                },
            ],
        },
        {
            code: `
/**
 * @deprecated
 */
const a = {
  b: 'Hi!',
};

const b = {
  a,
};
      `.trim(),
            errors: [
                {
                    messageId: "deprecated",
                    data: {
                        name: "a",
                        line: 9,
                    },
                },
            ],
        },
        {
            code: `
const a = {
  /**
   * @deprecated
   */
  b: 'Hi!',
};

function c(d: string = a.b) {}
      `.trim(),
            errors: [
                {
                    messageId: "deprecated",
                    data: {
                        name: "b",
                    },
                    line: 8,
                },
            ],
        },
        {
            code: `
/**
 * @deprecated
 */
type C = string;

class A<B extends C> {}
      `.trim(),
            errors: [
                {
                    line: 6,
                    messageId: "deprecated",
                    data: {
                        name: "C",
                    },
                },
            ],
        },
        {
            code: `
class A {
  /**
   * @deprecated
   */
  #b: string;

  constructor() {
    this.#b = 'Hi!';
  }
}
      `.trim(),
            errors: [
                {
                    line: 8,
                    messageId: "deprecated",
                    data: {
                        name: "#b",
                    },
                },
            ],
        },
        {
            code: `
declare namespace a {
  /**
   * @deprecated
   */
  const a: string;
}
declare namespace a {
  const a: string;
}

const b = a.a;
      `,
            errors: [
                {
                    messageId: "deprecated",
                    line: 12,
                    data: {
                        name: "a",
                    },
                },
            ],
        },
        {
            code: `
/** @deprecated */
declare function a<K extends string>(val: K): K;
declare function a(val: number): number;
declare function a(val: boolean): boolean;

a('B');
      `.trim(),
            errors: [
                {
                    messageId: "deprecatedSignature",
                    line: 6,
                    data: {
                        signature: `<"B">(val: "B"): "B"`,
                        name: "a",
                    },
                },
            ],
        },
        {
            code: `
class A {
  /** @deprecated */
  constructor(value: string) {}
}

new A('VALUE');
      `,
            errors: [
                {
                    messageId: "deprecatedSignature",
                },
            ],
        },
        {
            code: `
declare interface A {
  /** @deprecated */
  new (value: string): A;
}
declare const A: A;

new A('VALUE');
      `,
            errors: [
                {
                    messageId: "deprecatedSignature",
                },
            ],
        },
        {
            code: `
namespace JSX {
    export interface IntrinsicElements {
        /** @deprecated */
        example: {
            value?: string;
        }
    }
    export type ElementType = any;
}

console.log(<example></example>)
            `,
            errors: [
                {
                    messageId: "deprecated",
                    data: {
                        name: "example",
                    },
                },
            ],
        },
        {
            code: `
namespace JSX {
    export interface IntrinsicElements {
        example: {
            /** @deprecated */
            value?: string;
        }
    }
    export type ElementType = any;
}

console.log(<example value="Hello"></example>)
            `,
            errors: [
                {
                    messageId: "deprecated",
                    data: {
                        name: "value",
                    },
                },
            ],
        },
        {
            code: `
namespace JSX {
    export interface IntrinsicElements {
    }
    export type ElementType = any;
}

/** @deprecated */
declare const Test: (a: any) => string;

console.log(<Test></Test>)
            `,
            errors: [
                {
                    messageId: "deprecated",
                },
            ],
        },
    ],
});
