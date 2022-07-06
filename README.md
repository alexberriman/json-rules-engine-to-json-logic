<h1 align="center">
  <br>
  <a href="https://github.com/alexberriman/json-rules-engine-to-json-logic"><img src="./logo.svg" alt="json-rules-engine-to-json-logic" height="180"></a>
  <br><br>
  json-rules-engine-to-json-logic
  <br>
</h1>

> :warning: **This package is under active development**: Compatibility and APIs may change.

<h4 align="center">A minimal Typescript library for converting a <a href="https://github.com/CacheControl/json-rules-engine" target="_blank">json-rules-engine</a> condition to a <a href="https://github.com/jwadhams/json-logic-js/">JsonLogic</a> rule specification.</h4>

<p align="center">
  <a href="#why">Why?</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#docs">Docs</a> •
  <a href="#example">Example</a> •
  <a href="#compatibility">Compatibility</a> •
  <a href="#see-also">See Also</a> •
  <a href="#license">License</a>
</p>

## Why?

From the [json-rules-engine](https://github.com/CacheControl/json-rules-engine) README:

> `json-rules-engine` is a powerful, lightweight rules engine. Rules are composed of simple json structures, making them human readable and easy to persist.

Rule engines often come in handy because they allow you to:

- Express complex rules in JSON, and
- Can be evaluated securely (no use of `eval`)

Because of this, user defined rules can be persisted and securely evaluated on both your frontend and backend, making them ideal for scenarios when you need to allow configurable rules to be securely evaluated during runtime (e.g. an automation engine).

There are many 3rd party libraries that depend on rules engines, `json-logic` being one of the more popular options. As such, these libraries often expect as input, or they output a `json-logic` rule. This can sometimes be an issue as it might force you to adopt `json-logic` throughout your entire application, or it might mean you're unable to use those libraries if you choose to roll a different engine.

By providing the means to convert a `json-rules-engine` condition to a `json-logic` rule, `json-rules-engine-to-json-logic` allows you to take advantage of libraries that integrate with `json-logic` without having to adopt it across your entire application should you want to use `json-rules-engine`.

## Key Features

- **written in typescript**
- **zero dependencies**
- **minimal size:** `4kb` minified + zipped
- **works with plain JavaScript too** - you don't need to use TypeScript.
- **small api:** only two functions you need to learn
- **isomorphic:** works in Node.js and all modern browsers

## Installation

```bash
$ npm install json-rules-engine-to-json-logic
```

## Docs

- [toJsonRule](./docs/to-json-rule.md)

## Example

```ts
import { toJsonRule } from "json-rules-engine-to-json-logic";
import { Engine } from "json-rules-engine";
import jsonLogic from "json-logic-js";

const facts = {
  name: "Harry Potter",
};

const conditions = {
  all: [
    {
      fact: "name",
      operator: "equal",
      value: "Harry Potter",
    },
  ],
};

// evaluate using json-rules-engine
const engine = new Engine();
engine.addRule({
  conditions,
  event: { type: "isHarry" },
});
const result = await engine.run(facts);
const jsonRulesResult = result.results.length > 0;

// evaluate using json-logic
const jsonLogicRule = toJsonRule(conditions);
const jsonLogicResult = jsonLogic.apply(jsonLogicRule, facts);

// assert both return the same result
console.assert(jsonLogicResult === jsonRulesResult);
```

This is available in the [examples](./examples/01-basic-example.ts)

## Compatibility

Given both libraries offer different functionality, it is impossible to 100% convert between one and the other. In the case where a conversion isn't possible, a `Compatibility` error will be thrown, or a feature will be ignored. Current incompatibilities include:

- `json-rules-engine` uses [json\-path](https://github.com/JSONPath-Plus/JSONPath) whereas `json-logic` uses dot notation. `json-path` is the more powerful of the two, and a lot of functionality doesn't port over. A `Compatibility` error will be thrown if a condition uses `json-path` functionality that can't be ported over to dot notation.
- `json-rules-engine` provides a `params` property that allows you to create function handlers to provide dynamic facts during run-time. This isn't possible with `json-logic` and is therefore ignored.

## See Also

- [json-rules-engine](https://github.com/CacheControl/json-rules-engine)
- [json-logic](https://github.com/jwadhams/json-logic-js)

## License

[MIT](https://tldrlegal.com/license/mit-license)
