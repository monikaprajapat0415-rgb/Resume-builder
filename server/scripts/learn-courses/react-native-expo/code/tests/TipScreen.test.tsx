import { fireEvent, render, screen } from "@testing-library/react-native";
import App from "../App";

describe("Tip calculator screen", () => {
  it("shows the total for a typed bill", () => {
    render(<App />);
    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "100");
    expect(screen.getByText("Total: 115.00")).toBeTruthy();
  });

  it("splits the bill when a person is added", () => {
    render(<App />);
    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "100");
    fireEvent.press(screen.getByText("+"));
    fireEvent.press(screen.getByText("+"));
    expect(screen.getByText("Each person pays 38.33")).toBeTruthy();
  });
});
