test("getPlantsData caches the result", async () => {
  jest.resetModules();

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ["Peashooter", "Sunflower"],
  });

  const { getPlantsData } = require("../back-end.js");

  const first = await getPlantsData();
  const second = await getPlantsData();

  expect(first).toEqual(["Peashooter", "Sunflower"]);
  expect(second).toEqual(["Peashooter", "Sunflower"]);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});
