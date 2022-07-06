import { transform } from "../src/transform";
import { Engine } from "json-rules-engine";
import jsonLogic from "json-logic-js";

const facts = {
  name: "Harry Potter",
  currentSchoolYear: 5,
};

const conditions = {
  all: [
    {
      fact: "name",
      operator: "equal",
      value: "Harry Potter",
    },
    {
      fact: "currentSchoolYear",
      operator: "greaterThanInclusive",
      value: 5,
    },
  ],
};

// evaluate using json-rules-engine
const engine = new Engine();
engine.addRule({
  conditions,
  event: {
    type: "isDifficult",
  },
});
const result = await engine.run(facts);
const jsonRulesResult = result.results.length > 0;

// evaluate using json-logic
const jsonLogicRule = transform(conditions);
const jsonLogicResult = jsonLogic.apply(jsonLogicRule, facts);

// assert both return the same result
console.assert(jsonLogicResult === jsonRulesResult);
