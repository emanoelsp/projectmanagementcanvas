import { clampNodeDimensions } from "../canvas-config";

describe("clampNodeDimensions", () => {
  it("enforces BMC minimum size even when saved style is shorter", () => {
    expect(clampNodeDimensions("bmc", 400, 200)).toEqual({ width: 900, height: 920 });
  });

  it("keeps larger custom BMC size", () => {
    expect(clampNodeDimensions("bmc", 1100, 1100)).toEqual({ width: 1100, height: 1100 });
  });

  it("does not force size on other node types", () => {
    expect(clampNodeDimensions("input", 240, 160)).toEqual({ width: 240, height: 160 });
    expect(clampNodeDimensions("input")).toEqual({});
  });
});
