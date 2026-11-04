import { calculateTip } from "../tip";

describe("calculateTip", () => {
  it("adds 15 percent and splits the bill", () => {
    const r = calculateTip(100, 15, 3, false);
    expect(r.tip).toBeCloseTo(15);
    expect(r.total).toBeCloseTo(115);
    expect(r.perPerson).toBeCloseTo(38.33, 2);
  });

  it("rounds the tip up when asked", () => {
    expect(calculateTip(33, 15, 1, true).tip).toBe(5);
  });

  it("rejects zero people", () => {
    expect(() => calculateTip(10, 10, 0, false)).toThrow();
  });
});
