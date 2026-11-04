import { streak } from "../habits";

const today = new Date(2026, 10, 4); // 4 November 2026

describe("streak", () => {
  it("counts consecutive days ending today", () => {
    expect(streak(["2026-11-04", "2026-11-03", "2026-11-02"], today)).toBe(3);
  });
  it("keeps the streak alive if today is not done yet", () => {
    expect(streak(["2026-11-03", "2026-11-02"], today)).toBe(2);
  });
  it("stops at a gap", () => {
    expect(streak(["2026-11-04", "2026-11-02"], today)).toBe(1);
  });
  it("is zero with no recent days", () => {
    expect(streak(["2026-10-01"], today)).toBe(0);
  });
});
