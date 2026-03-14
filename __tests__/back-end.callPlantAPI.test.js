test("Plant API is up and returns some data", async () => {
  const response = await fetch("https://pvz-2-api.vercel.app/api/plants");
  const data = await response.json();

  expect(response.ok).toBe(true);
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
});
