import { render, screen, fireEvent } from "@testing-library/react";
import AskAICard from "../features/student/assistant/AskAICard";

test("renders Ask NexDS AI button", () => {
  render(<AskAICard />);

  const button = screen.getByText("Ask NexDS AI");
  expect(button).toBeInTheDocument();

  fireEvent.click(button);
});
