import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const CreateNotice = () => {
  const [form, setForm] = useState({
    title: "",
    audience: "",
    description: ""
  });

  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader
        title="Add Notice"
        subtitle="Publish a notice"
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
        value={form.audience}
        onChange={(e) =>
          setForm({ ...form, audience: e.target.value })
        }
      >
        <option value="">Audience</option>
        <option>Students</option>
        <option>Teachers</option>
        <option>All</option>
      </select>

      <textarea
        rows={4}
        placeholder="Description"
        className="w-full border rounded-lg p-2"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <Button variant="primary">Publish Notice</Button>
    </div>
  );
};

export default CreateNotice;
