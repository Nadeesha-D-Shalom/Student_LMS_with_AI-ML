import { render, screen } from "@testing-library/react";
import Dashboard from "../features/student/dashboard/Dashboard";

test("renders dashboard announcements section", () => {
  render(<Dashboard />);

  expect(screen.getByText("Announcements")).toBeInTheDocument();
  expect(screen.getByText("Upcoming Classes")).toBeInTheDocument();
});
