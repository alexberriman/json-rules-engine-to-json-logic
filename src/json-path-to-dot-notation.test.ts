import { CompatibilityError } from "./compatibility-error";
import { jsonPathToDotNotation } from "./json-path-to-dot-notation";

describe("basic examples", () => {
  test.each([
    ["$.store.book[0].title", "store.book.0.title"],
    ["$['store']['book'][0]['title']", "store.book.0.title"],
    ["$['store'].book[0].title", "store.book.0.title"],
    ["$.store.bicycle.color", "store.bicycle.color"],
  ])("%s", (jsonPath, expected) => {
    const actual = jsonPathToDotNotation(jsonPath);
    expect(actual).toEqual(expected);
  });
});

describe("throws compatibility errors when can not convert", () => {
  test.each([
    ["$.store.book[?(@.price < 10)]"],
    ["$.store.book[?(@.price < $.expensive)]"],
    ["[?(@.color=='red')]"],
    ["[?(@.category=='fiction' || @.price < 10)]"],
    ["$.store..price"],
    ["$..price"],
    ["$.store.book[*]"],
    ["$..*"],
    ["$..book[?(@.category == 'fiction' || @.category == 'reference')]"],
    ["$..book[?(@.author =~ /.*Tolkien/i)]"],
  ])("%s", (jsonPath) => {
    expect(() => {
      jsonPathToDotNotation(jsonPath);
    }).toThrow(CompatibilityError);
  });
});
