import { Engine, TopLevelCondition } from "json-rules-engine";
import jsonLogic from "json-logic-js";
import { toJsonRule } from "./to-json-rule";

test.each<[string, TopLevelCondition, Record<string, unknown>, boolean]>([
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
    true,
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
    false,
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
    true,
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
    false,
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
    true,
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
    false,
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
    true,
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
    true,
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
    false,
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
    true,
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
    false,
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
    true,
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
    true,
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
    false,
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
    true,
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
    false,
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
    false,
  ],
  [
    "any returns true when one is true",
    {
      any: [
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
    true,
  ],
  // path notation
  [
    "path parameter",
    {
      all: [
        {
          fact: "personal-info",
          path: "$.name.first",
          operator: "equal",
          value: "harry",
        },
        {
          fact: "personal-info",
          path: "$.friends[0]",
          operator: "equal",
          value: "hermione",
        },
      ],
    },
    {
      "personal-info": {
        name: { first: "harry", last: "potter" },
        friends: ["hermione", "ron"],
      },
    },
    true,
  ],
  // nested top level condition
  [
    "nested top level condition",
    {
      all: [
        {
          any: [
            {
              all: [
                { fact: "firstName", operator: "equal", value: "ron" },
                { fact: "lastName", operator: "equal", value: "weasley" },
              ],
            },
            {
              all: [
                { fact: "firstName", operator: "equal", value: "harry" },
                { fact: "lastName", operator: "equal", value: "potter" },
              ],
            },
            {
              all: [
                { fact: "firstName", operator: "equal", value: "hermione" },
                { fact: "lastName", operator: "equal", value: "granger" },
              ],
            },
          ],
        },
        {
          fact: "birthYear",
          operator: "equal",
          value: 1980,
        },
      ],
    },
    { firstName: "harry", lastName: "potter", birthYear: 1980 },
    true,
  ],
  // in (truthy)
  [
    "in (truthy)",
    {
      all: [
        {
          fact: "firstName",
          operator: "in",
          value: ["ron", "harry", "hermione"],
        },
      ],
    },
    { firstName: "harry" },
    true,
  ],
  // in (falsy)
  [
    "in (falsy)",
    {
      all: [
        {
          fact: "firstName",
          operator: "in",
          value: ["ron", "hermione"],
        },
      ],
    },
    { firstName: "harry" },
    false,
  ],
  // not in (truthy)
  [
    "not in (truthy)",
    {
      all: [
        {
          fact: "firstName",
          operator: "notIn",
          value: ["ron", "hermione"],
        },
      ],
    },
    { firstName: "harry" },
    true,
  ],
  // not in (falsy)
  [
    "in (falsy)",
    {
      all: [
        {
          fact: "firstName",
          operator: "notIn",
          value: ["ron", "harry", "hermione"],
        },
      ],
    },
    { firstName: "harry" },
    false,
  ],
  // contains (truthy)
  [
    "contains (truthy)",
    {
      all: [
        {
          fact: "wizards",
          operator: "contains",
          value: "harry potter",
        },
      ],
    },
    { wizards: ["harry potter", "hermione granger", "ron weasley"] },
    true,
  ],
  // contains (falsy)
  [
    "contains (falsy)",
    {
      all: [
        {
          fact: "wizards",
          operator: "contains",
          value: "draco malfoy",
        },
      ],
    },
    { wizards: ["harry potter", "hermione granger", "ron weasley"] },
    false,
  ],
  // doesNotContain (truthy)
  [
    "doesNotContain (truthy)",
    {
      all: [
        {
          fact: "wizards",
          operator: "doesNotContain",
          value: "draco malfoy",
        },
      ],
    },
    { wizards: ["harry potter", "hermione granger", "ron weasley"] },
    true,
  ],
  // doesNotContain (falsy)
  [
    "doesNotContain (falsy)",
    {
      all: [
        {
          fact: "wizards",
          operator: "doesNotContain",
          value: "ron weasley",
        },
      ],
    },
    { wizards: ["harry potter", "hermione granger", "ron weasley"] },
    false,
  ],
])("%s", async (scenario, input, facts, expected) => {
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
  const jsonLogicRule = toJsonRule(input);
  const jsonLogicResult = jsonLogic.apply(jsonLogicRule, facts);

  expect(jsonLogicResult).toEqual(jsonRulesResult);
  expect(jsonLogicResult).toEqual(expected);
});
