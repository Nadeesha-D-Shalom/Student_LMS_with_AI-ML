const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("lms_token");

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  // Only set JSON content-type when NOT FormData
  if (!isFormData && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // IMPORTANT: do NOT redirect from here (causes refresh loops)
  if (response.status === 401) {
    localStorage.removeItem("lms_token");
    throw new Error("UNAUTHORIZED");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data && data.error ? data.error : "Request failed";
    throw new Error(message);
  }

  return data;
};

export default API_BASE_URL;
