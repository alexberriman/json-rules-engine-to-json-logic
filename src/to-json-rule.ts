import type {
  ConditionProperties,
  NestedCondition,
  TopLevelCondition,
} from "json-rules-engine";
import type {
  AdditionalOperation,
  ReservedOperations,
  RulesLogic,
} from "json-logic-js";
import { jsonPathToDotNotation } from "./json-path-to-dot-notation";

export type JsonRulesEngineCondition = TopLevelCondition;

export type JsonLogicRule = RulesLogic<AdditionalOperation>;

type JsonRulesScalarOperators =
  | "equal"
  | "notEqual"
  | "lessThan"
  | "lessThanInclusive"
  | "greaterThan"
  | "greaterThanInclusive";

type JsonRulesArrayOperators = "in" | "notIn" | "contains" | "doesNotContain";

type JsonRulesEngineOperator =
  | JsonRulesScalarOperators
  | JsonRulesArrayOperators;

type JsonLogicOperator = ReservedOperations;

const OperatorMapping: Record<JsonRulesEngineOperator, JsonLogicOperator> = {
  equal: "===",
  notEqual: "!==",
  lessThan: "<",
  lessThanInclusive: "<=",
  greaterThan: ">",
  greaterThanInclusive: ">=",
  in: "in",
  notIn: "in",
  contains: "some",
  doesNotContain: "none",
};

function toJsonPath({ fact, path }: ConditionProperties): string {
  if (!path) {
    return fact;
  }

  return `${fact}.${jsonPathToDotNotation(path)}`;
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
    return transformTopLevel(input);
  }

  const operator = input.operator as JsonRulesEngineOperator;
  const rule = {
    [OperatorMapping[operator]]: [{ var: toJsonPath(input) }, input.value],
  };

  if (operator === "notIn") {
    return { "!": [rule] };
  }

  if (["contains", "doesNotContain"].includes(operator)) {
    return {
      [operator === "contains" ? "some" : "none"]: [
        { var: toJsonPath(input) },
        { [OperatorMapping.equal]: [{ var: "" }, input.value] },
      ],
    };
  }

  return rule;
}

function transformTopLevel(
  input: TopLevelCondition
): RulesLogic<AdditionalOperation> {
  if ("all" in input) {
    return { and: input.all.map(transformNested) };
  }

  return { or: input.any.map(transformNested) };
}

export function toJsonRule(condition: JsonRulesEngineCondition): JsonLogicRule {
  return transformTopLevel(condition);
}
