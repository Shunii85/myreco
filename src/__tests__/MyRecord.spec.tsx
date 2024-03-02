import { render, screen, waitFor } from "@testing-library/react";
import { MyRecord } from "../MyRecord";

describe("title", () => {
  it("should render title", async () => {
    render(<MyRecord />);

    await waitFor(() => {
      expect(screen.getByText("マイレコ")).toBeInTheDocument();
    });
  });
});
