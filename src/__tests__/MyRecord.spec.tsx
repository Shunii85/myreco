import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MyRecord } from "../MyRecord";

jest.mock("../utils/supabaseFunctions", () => {
  return {
    getAllRecords: jest.fn().mockResolvedValue([
      { id: "1", title: "test title1", time: 10 },
      { id: "2", title: "test title2", time: 20 },
      { id: "3", title: "test title3", time: 30 },
    ]),
    addRecords: jest.fn().mockImplementation((title: string, time: number) => {
      return Promise.resolve([{ id: "4", title: title, time: time }]);
    }),
    deleteRecord: jest.fn(),
    updateRecord: jest
      .fn()
      .mockResolvedValue([{ id: "1", title: "edited title", time: 100 }]),
  };
});

describe("title", () => {
  it("should render loading page", async () => {
    render(<MyRecord />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  it("should render title", async () => {
    render(<MyRecord />);

    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });
  });

  it("should render records", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("my-records").querySelectorAll("li").length
      ).toBe(3);
    });
  });

  it("should render add button", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    expect(screen.getByTestId("open-modal")).toBeInTheDocument();
  });

  it("modal-title shuould be 新規登録", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("open-modal"));

    expect(screen.getByTestId("modal-title")).toHaveTextContent("新規登録");
  });

  it("shuold add a new record", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    const recordsBefore = screen
      .getByTestId("my-records")
      .querySelectorAll("li").length;

    await userEvent.click(screen.getByTestId("open-modal"));

    const titleInput = screen.getByTestId("title");
    const timeInput = screen.getByTestId("time");
    const submitButton = screen.getByTestId("submit");
    await userEvent.type(titleInput, "test title4");
    await userEvent.type(timeInput, "40");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId("my-records").querySelectorAll("li").length
      ).toBe(recordsBefore + 1);
      expect(screen.getByText("test title4")).toBeInTheDocument();
    });
  });

  it("should appear errors, clicking without text of title", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("open-modal"));

    const titleInput = screen.getByTestId("title");
    const timeInput = screen.getByTestId("time");
    const submitButton = screen.getByTestId("submit");
    await userEvent.clear(titleInput);
    await userEvent.type(timeInput, "40");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("title-error")).toBeInTheDocument();
    });
  });

  it("should appear errors, clicking without text of time", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId("open-modal"));

    const titleInput = screen.getByTestId("title");
    const timeInput = screen.getByTestId("time");
    const submitButton = screen.getByTestId("submit");
    await userEvent.type(titleInput, "test title4");
    await userEvent.clear(timeInput);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("time-error")).toHaveTextContent(
        "時間の入力は必須です。"
      );
    });

    // timeInputに0未満の値を入れる
    await userEvent.click(screen.getByTestId("open-modal"));
    await userEvent.type(timeInput, "-1");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("time-error")).toHaveTextContent(
        "0以上の数値を入力してください。"
      );
    });
  });

  it("should delete a record", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    const recordsBefore = screen
      .getByTestId("my-records")
      .querySelectorAll("li").length;

    await userEvent.click(screen.getAllByTestId("delete-button")[0]);

    await waitFor(() => {
      expect(
        screen.getByTestId("my-records").querySelectorAll("li").length
      ).toBe(recordsBefore - 1);
    });
  });

  it("should open edit mode", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByTestId("edit-button")[0]);

    await waitFor(() => {
      expect(screen.getByTestId("modal-title")).toHaveTextContent("記録編集");
    });
  });

  it("should edit a record", async () => {
    render(<MyRecord />);
    await waitFor(() => {
      expect(screen.getByTestId("app-title")).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByTestId("edit-button")[0]);

    const titleInput = screen.getByTestId("title");
    const timeInput = screen.getByTestId("time");
    const submitButton = screen.getByTestId("submit");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "edited title");
    await userEvent.clear(timeInput);
    await userEvent.type(timeInput, "100");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("edited title")).toBeInTheDocument();
      expect(screen.getByText("100時間")).toBeInTheDocument();
    });
  });
});
