import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useLocalTime } from "@/hooks/useLocalTime";

function Clock() {
  const time = useLocalTime();
  return <span data-testid="clock">{time ?? "pendiente"}</span>;
}

describe("useLocalTime", () => {
  it("devuelve la hora en formato HH:MM:SS tras montar", async () => {
    render(<Clock />);
    const clock = await screen.findByTestId("clock");
    expect(clock.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
