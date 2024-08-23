import { parseNodeType } from "./parse-node-type";

describe("parseNodeType", () => {
  it.each`
    nodeKeyword             | primitive
    ${"TSAnyKeyword"}       | ${"any"}
    ${"TSUnknownKeyword"}   | ${"unknown"}
    ${"TSNumberKeyword"}    | ${"number"}
    ${"TSBigIntKeyword"}    | ${"bigint"}
    ${"TSObjectKeyword"}    | ${"object"}
    ${"TSBooleanKeyword"}   | ${"boolean"}
    ${"TSStringKeyword"}    | ${"string"}
    ${"TSUndefinedKeyword"} | ${"undefined"}
    ${"TSNullKeyword"}      | ${"null"}
    ${"TSNeverKeyword"}     | ${"never"}
    ${"TSVoidKeyword"}      | ${"void"}
    ${"TSIntrinsicKeyword"} | ${"intrinsic"}
    ${"TSTypeOperator"}     | ${"typeOperator"}
    ${"TSArrayType"}        | ${"array"}
    ${"TSUnionType"}        | ${"union"}
    ${"TSTypeReference"}    | ${"typeReference"}
    ${"TSFunctionType"}     | ${"function"}
    ${"TSConstructorType"}  | ${"constructor"}
    ${"TSTypeLiteral"}      | ${"typeLiteral"}
  `(
    "should return $primitive for $nodeKeyword",
    ({ nodeKeyword, primitive }) => {
      const result = parseNodeType(nodeKeyword);
      expect(result).toBe(primitive);
    }
  );
});
