import { Engine, TopLevelCondition } from "json-rules-engine";
import jsonLogic from "json-logic-js";
import { transform } from "./transform";

test.each<[string, TopLevelCondition, Record<string, unknown>]>([
  [
    "basic equals operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "equal",
          value: 1,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "basic equals operator (falsy)",
    {
      all: [
        {
          fact: "age",
          operator: "equal",
          value: 2,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "basic not equals operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "notEqual",
          value: 2,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "basic not equals operator (falsy)",
    {
      all: [
        {
          fact: "age",
          operator: "notEqual",
          value: 1,
        },
      ],
    },
    { age: 1 },
  ],
  // lessThan (<)
  [
    "less than operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "lessThan",
          value: 10,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "less than operator (falsy)",
    {
      all: [
        {
          fact: "age",
          operator: "lessThan",
          value: 0,
        },
      ],
    },
    { age: 1 },
  ],
  // lessThanInclusive (<=)
  [
    "less than inclusive operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "lessThanInclusive",
          value: 1,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "less than inclusive operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "lessThanInclusive",
          value: 3,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "less than inclusive operator (falsy)",
    {
      all: [
        {
          fact: "age",
          operator: "lessThanInclusive",
          value: 0,
        },
      ],
    },
    { age: 1 },
  ],
  // greater than (<)
  [
    "greater than operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "greaterThan",
          value: 0,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "greater than operator (falsy)",
    {
      all: [
        {
          fact: "age",
          operator: "greaterThan",
          value: 10,
        },
      ],
    },
    { age: 1 },
  ],
  // greaterThanInclusive (<=)
  [
    "greater than inclusive operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "greaterThanInclusive",
          value: 1,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "greater than inclusive operator (truthy)",
    {
      all: [
        {
          fact: "age",
          operator: "greaterThanInclusive",
          value: 0,
        },
      ],
    },
    { age: 1 },
  ],
  [
    "greater than inclusive operator (falsy)",
    {
      all: [
        {
          fact: "age",
          operator: "greaterThanInclusive",
          value: 10,
        },
      ],
    },
    { age: 1 },
  ],
  // all facts
  [
    "multiple conditions in all evaluate to true",
    {
      all: [
        {
          fact: "firstName",
          operator: "equal",
          value: "harry",
        },
        {
          fact: "lastName",
          operator: "equal",
          value: "potter",
        },
      ],
    },
    { firstName: "harry", lastName: "potter" },
  ],
  [
    "multiple conditions in all evaluate to false when one is false",
    {
      all: [
        {
          fact: "firstName",
          operator: "equal",
          value: "harry",
        },
        {
          fact: "birthYear",
          operator: "equal",
          value: 1990,
        },
        {
          fact: "lastName",
          operator: "equal",
          value: "potter",
        },
      ],
    },
    { firstName: "harry", lastName: "potter", birthYear: 1980 },
  ],
  // any
  [
    "any returns false when none are true",
    {
      all: [
        {
          fact: "firstName",
          operator: "notEqual",
          value: "harry",
        },
        {
          fact: "birthYear",
          operator: "equal",
          value: 1990,
        },
        {
          fact: "lastName",
          operator: "notEqual",
          value: "potter",
        },
      ],
    },
    { firstName: "harry", lastName: "potter", birthYear: 1980 },
  ],
  [
    "any returns true when one is true",
    {
      all: [
        {
          fact: "firstName",
          operator: "notEqual",
          value: "harry",
        },
        {
          fact: "birthYear",
          operator: "equal",
          value: 1980,
        },
        {
          fact: "lastName",
          operator: "notEqual",
          value: "potter",
        },
      ],
    },
    { firstName: "harry", lastName: "potter", birthYear: 1980 },
  ],
])("%s", async (scenario, input, facts) => {
  // fetch result from json-rules-logic
  const engine = new Engine();
  engine.addRule({
    conditions: input,
    event: {
      type: "result",
    },
  });
  const result = await engine.run(facts);
  const jsonRulesResult = result.results.length > 0;

  // convert to json logic rule and evaluate
  const jsonLogicRule = transform(input);
  const jsonLogicResult = jsonLogic.apply(jsonLogicRule, facts);

  expect(jsonLogicResult).toEqual(jsonRulesResult);
});
