import { asMoney, parseCents } from "../money";

describe("money helpers", () => {
  it.each([
    ["12", 1200],
    ["12.5", 1250],
    ["12.50", 1250],
    ["0.99", 99],
  ])("parses %s", (text, cents) => {
    expect(parseCents(text)).toBe(cents);
  });

  it.each(["abc", "", "-3", "1.234", "0"])("rejects %s", (text) => {
    expect(parseCents(text)).toBeNull();
  });

  it("formats cents", () => {
    expect(asMoney(1970)).toBe("19.70");
  });
});
