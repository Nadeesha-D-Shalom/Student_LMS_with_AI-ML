import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const Settings = () => {
  const [instituteName, setInstituteName] = useState("My Institute");
  const [timezone, setTimezone] = useState("Asia/Colombo");
  const [notify, setNotify] = useState(true);

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" subtitle="Institute preferences (UI only)." />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Institute Name</label>
            <input
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="Asia/Colombo">Asia/Colombo</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="h-4 w-4"
              />
              Enable notifications for new registrations & payments
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => alert("Saved (UI only)")}>Save</Button>
          <Button variant="secondary" onClick={() => alert("Reset (UI only)")}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
