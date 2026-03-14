test("getToughnessRank returns expected rank values", () => {
  const { getToughnessRank } = require("../public/battle.js");

  expect(getToughnessRank("fragile")).toBe(1);
  expect(getToughnessRank("300")).toBe(2);
  expect(getToughnessRank("UNdYinG")).toBe(9);
  expect(getToughnessRank("something unknown")).toBe(0);
});
