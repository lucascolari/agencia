import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MediaFrame } from "@/components/media/MediaFrame";

describe("MediaFrame", () => {
  it("renderiza un video con poster cuando la fuente es video", () => {
    const { container } = render(
      <MediaFrame
        media={{
          kind: "video",
          src: "/media/hero.mp4",
          poster: "/media/hero.jpg",
          alt: "Reel de la agencia",
          priority: "critical",
        }}
      />,
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster", "/media/hero.jpg");
  });

  it("renderiza un placeholder editorial con el alt visible", () => {
    render(
      <MediaFrame
        media={{
          kind: "placeholder",
          alt: "Identidad visual de Núcleo",
          tone: "#23303a",
          priority: "high",
        }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Identidad visual de Núcleo" }),
    ).toBeInTheDocument();
  });
});
