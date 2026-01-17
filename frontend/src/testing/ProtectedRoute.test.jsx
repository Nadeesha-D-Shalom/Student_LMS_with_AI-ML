import { render, screen } from "@testing-library/react";
import RootRedirect from "../routes/RootRedirect";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "STUDENT" },
    loading: false
  })
}));

test("redirects student to /student", () => {
  render(<RootRedirect />);
  expect(screen.getByText("Redirected to /student")).toBeInTheDocument();
});
