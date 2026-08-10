import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("une clases y descarta valores falsy", () => {
    expect(cn("a", false, "b", undefined, null, "c")).toBe("a b c");
  });
});
