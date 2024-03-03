import { render, screen, waitFor } from "@testing-library/react";
// import { userEvent } from "@testing-library/user-event";
import { MyRecord } from "../MyRecord";
import { Record } from "../domain/record";
import { getAllRecords } from "../utils/supabaseFunctions";

jest.mock("../utils/supabaseFunctions", () => {
  return {
    getAllRecords: jest.fn(),
  };
});

describe("title", () => {
  beforeEach(() => {
    (getAllRecords as jest.Mock).mockResolvedValue([
      new Record("1", "test title", 10),
      new Record("2", "test title", 10),
      new Record("3", "test title", 10),
    ]);
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

  // it("shuold add a new record", async () => {
  //   render(<MyRecord />);

  //   // addRecordsをモック化
  //   const mockAddRecords = jest.fn().mockReturnValue(
  //     new Promise<Record[]>((resolve) => {
  //       resolve([new Record("1", "test title", 10)]);
  //     })
  //   );
  //   jest.mock("../utils/supabaseFunctions", () => {
  //     return {
  //       addRecords: mockAddRecords,
  //     };
  //   });

  //   // 画面が表示されることを確認
  //   await waitFor(() => {
  //     expect(screen.getByText("マイレコ")).toBeInTheDocument();
  //   });

  //   // リストアイテムの数を取得
  //   const recordsBefore = screen
  //     .getByTestId("my-records")
  //     .querySelectorAll("li").length;
  //   console.log(recordsBefore);

  //   // モーダルを開く
  //   await userEvent.click(screen.getByTestId("open-modal"));

  //   const titleInput = screen.getByTestId("title");
  //   const timeInput = screen.getByTestId("time");
  //   const submitButton = screen.getByTestId("submit");

  //   // フォームの値を入力
  //   await userEvent.type(titleInput, "test title");
  //   await userEvent.type(timeInput, "10");
  //   // フォームを送信
  //   await userEvent.click(submitButton);

  //   // リストが一つ増えていることを確認
  //   await waitFor(() => {
  //     expect(
  //       screen.getByTestId("my-records").querySelectorAll("li").length
  //     ).toBe(recordsBefore + 1);
  //   });
  // });
});
