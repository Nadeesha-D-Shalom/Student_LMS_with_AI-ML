module.exports = {
  useNavigate: () => jest.fn(),

  useLocation: () => ({
    pathname: "/test-path"
  }),

  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: () => null,
  Navigate: ({ to }) => <div>Redirected to {to}</div>
};
