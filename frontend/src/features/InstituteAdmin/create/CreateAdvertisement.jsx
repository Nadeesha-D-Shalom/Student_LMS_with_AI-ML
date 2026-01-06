import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const CreateAdvertisement = () => {
  const [form, setForm] = useState({
    title: "",
    placement: "",
    status: ""
  });

  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader
        title="Add Advertisement"
        subtitle="Create a banner placement"
      />

      <input
        placeholder="Title"
        className="w-full border rounded-lg p-2"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <select
        className="w-full border rounded-lg p-2"
        value={form.placement}
        onChange={(e) =>
          setForm({ ...form, placement: e.target.value })
        }
      >
        <option value="">Placement</option>
        <option>Dashboard</option>
        <option>Classes</option>
      </select>

      <select
        className="w-full border rounded-lg p-2"
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="">Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <Button variant="primary">Save Advertisement</Button>
    </div>
  );
};

export default CreateAdvertisement;
