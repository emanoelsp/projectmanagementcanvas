import { render, screen, fireEvent } from "@testing-library/react";
import { InfoTooltip } from "../InfoTooltip";

describe("InfoTooltip", () => {
  it("renders help text in a portal on document.body, not inside the trigger wrapper", () => {
    render(
      <div data-testid="clip-box" style={{ overflow: "hidden", width: 80, height: 40 }}>
        <InfoTooltip text="Detalhe do bloco com exemplo" />
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ajuda" }));

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Detalhe do bloco com exemplo");
    expect(tooltip.parentElement).toBe(document.body);
    expect(screen.getByTestId("clip-box")).not.toContainElement(tooltip);
  });

  it("closes when clicking outside", () => {
    render(<InfoTooltip text="Texto de ajuda" />);
    fireEvent.click(screen.getByRole("button", { name: "Ajuda" }));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
