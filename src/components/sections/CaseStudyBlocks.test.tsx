import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseStudyBlocks } from "@/components/sections/CaseStudyBlocks";
import type { CaseStudyBlock } from "@/types/content";

const blocks: CaseStudyBlock[] = [
  { type: "text", heading: "Del logo al sistema", body: "Cuerpo del texto." },
  {
    type: "quote",
    quote: "Una frase memorable.",
    author: "Cliente",
  },
  {
    type: "metrics",
    items: [{ value: "+38%", label: "Reconocimiento" }],
  },
];

describe("CaseStudyBlocks", () => {
  it("renderiza cada tipo de bloque modular", () => {
    render(<CaseStudyBlocks blocks={blocks} />);
    expect(
      screen.getByRole("heading", { name: "Del logo al sistema" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Una frase memorable/)).toBeInTheDocument();
    expect(screen.getByText("+38%")).toBeInTheDocument();
    expect(screen.getByText("Reconocimiento")).toBeInTheDocument();
  });
});
