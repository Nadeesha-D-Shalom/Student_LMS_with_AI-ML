const KEY_REPORTS = "ia_reports_v1";
const KEY_ADMINS = "ia_admins_v1";
const KEY_MESSAGES = "ia_messages_v1";

export const storage = {
  getReports() {
    try {
      return JSON.parse(localStorage.getItem(KEY_REPORTS) || "[]");
    } catch {
      return [];
    }
  },
  saveReports(reports) {
    localStorage.setItem(KEY_REPORTS, JSON.stringify(reports));
  },

  getAdmins() {
    try {
      return JSON.parse(localStorage.getItem(KEY_ADMINS) || "null");
    } catch {
      return null;
    }
  },
  saveAdmins(admins) {
    localStorage.setItem(KEY_ADMINS, JSON.stringify(admins));
  },

  getMessages() {
    try {
      return JSON.parse(localStorage.getItem(KEY_MESSAGES) || "null");
    } catch {
      return null;
    }
  },
  saveMessages(messages) {
    localStorage.setItem(KEY_MESSAGES, JSON.stringify(messages));
  }
};
