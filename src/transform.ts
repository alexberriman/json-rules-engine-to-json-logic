import type { NestedCondition, TopLevelCondition } from "json-rules-engine";
import type {
  AdditionalOperation,
  ReservedOperations,
  RulesLogic,
} from "json-logic-js";

type JsonRulesEngineOperator =
  | "equal"
  | "notEqual"
  | "lessThan"
  | "lessThanInclusive"
  | "greaterThan"
  | "greaterThanInclusive"
  | "in"
  | "notIn"
  | "contains"
  | "doesNotContain";

type JsonLogicOperator = ReservedOperations;

const OperatorMapping: Record<JsonRulesEngineOperator, JsonLogicOperator> = {
  // string and numeric
  equal: "===",
  notEqual: "!==",
  // numeric
  lessThan: "<",
  lessThanInclusive: "<=",
  greaterThan: ">",
  greaterThanInclusive: ">=",
  // array
  in: "in",
  notIn: "in",
  contains: "in",
  doesNotContain: "in",
};

function isScalar(operator: JsonRulesEngineOperator) {
  return [
    "equal",
    "notEqual",
    "lessThan",
    "lessThanInclusive",
    "greaterThan",
    "greaterThanInclusive",
  ].includes(operator);
}

function jsonPathToDotNotation(input: string): string {
  // @todo
  return input;
}

function isTopLevelCondition(
  condition: TopLevelCondition | NestedCondition
): condition is TopLevelCondition {
  return "all" in condition || "any" in condition;
}

function transformNested(
  input: NestedCondition
): RulesLogic<AdditionalOperation> {
  if (isTopLevelCondition(input)) {
    // @todo
    return { "<": [{ var: "temp" }, 110] };
  }

  if (isScalar(input.operator as JsonRulesEngineOperator)) {
    return {
      [OperatorMapping[input.operator as JsonRulesEngineOperator]]: [
        { var: jsonPathToDotNotation(input.fact) },
        input.value,
      ],
    };
  }

  // @todo
  return { "=": [1, 1] };
}

function transformTopLevel(
  input: TopLevelCondition
): RulesLogic<AdditionalOperation> {
  if ("all" in input) {
    return { and: input.all.map(transformNested) };
  }

  return { or: input.any.map(transformNested) };
}

export function transform(
  input: TopLevelCondition
): RulesLogic<AdditionalOperation> {
  return transformTopLevel(input);
}
