<h1 align="center">
  <br>
  <a href="https://github.com/alexberriman/json-rules-engine-to-json-logic"><img src="./logo.svg" alt="json-rules-engine-to-json-logic" height="200"></a>
  <br><br>
  json-rules-engine-to-json-logic
  <br>
</h1>

> :warning: **This package is under active development**: Compatibility and APIs may change.

<h4 align="center">A minimal Typescript library for converting a <a href="https://github.com/CacheControl/json-rules-engine" target="_blank">json-rules-engine</a> condition to a <a href="https://github.com/jwadhams/json-logic-js/">JsonLogic</a> rule specification (and vice versa).</h4>

<p align="center">
  <a href="#why">Why?</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#docs">Docs</a> •
  <a href="#compatibility">Compatibility</a> •
  <a href="#example">Example</a> •
  <a href="#see-also">See Also</a> •
  <a href="#license">License</a>
</p>

## Why?

`json-rules-engine` is a powerful, lightweight rules engine.

Rules engines often come in handy because they allow you to:

- Express complex rules in JSON, and
- Are secure to evaluate (no use of `eval`)

Because of this, you can allow user defined rules to be created which can then be securely shared, stored and executed between both your backend and frontend.

As such, there are many 3rd party libraries that depend on various rules engines. `json-logic` is a popular rules engine that some libraries use and which sometimes expose through their API an input that allows you to pass through a set of `json-logic` rules (<a href="https://react-querybuilder.js.org/" target="_blank">react-querybuilder</a> being one example).

By providing the ability to convert from the specification from one library to another, `json-rules-engine-to-json-logic` lets you use `json-rules-engine` throughout your project while also letting you take advantage of libraries that expect as input a `json-logic` rule type.

## Key Features

- **written in typescript**
- **zero dependencies**
- **minimal size:** `4kb` minified + zipped
- **works with plain JavaScript too** - you don't need to use TypeScript.
- **small api:** only two functions you need to learn
- **isomorphic:** works in Node.js and all modern browsers

## Installation

```bash
$ npm install json-rules-engine
```

## Docs

- [transform](./docs/transform.md)

## Compatibility

Given that both libraries offer different functionality, it is impossible to 100% convert between one and the other. In the case where a conversion isn't possible, a `Compatibility` error will be thrown. Current incompatibilities include:

- `json-rules-engine` uses [json-path](https://github.com/JSONPath-Plus/JSONPath) whereas `json-logic` uses dot notation. `json-path` is the more powerful of the two, and a lot of functionality doesn't port over.

## Example

```ts
const conditions = {
  any: [
    {
      all: [
        {
          fact: "gameDuration",
          operator: "equal",
          value: 40,
        },
        {
          fact: "personalFoulCount",
          operator: "greaterThanInclusive",
          value: 5,
        },
      ],
    },
    {
      all: [
        {
          fact: "gameDuration",
          operator: "equal",
          value: 48,
        },
        {
          fact: "personalFoulCount",
          operator: "greaterThanInclusive",
          value: 6,
        },
      ],
    },
  ],
};
```

This is available in the [examples](./examples/01-basic-example.ts)

## See Also

- [json-rules-engine](https://github.com/CacheControl/json-rules-engine)
- [json-logic](https://github.com/jwadhams/json-logic-js)

## License

[MIT](https://tldrlegal.com/license/mit-license)
