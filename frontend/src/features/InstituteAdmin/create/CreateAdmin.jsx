import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    adminId: "",
    role: "",
    email: "",
    phone: ""
  });

  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader
        title="Add Admin"
        subtitle="Create a new admin account"
      />

      {Object.keys(form).map((f) => (
        <input
          key={f}
          placeholder={f.toUpperCase()}
          className="w-full border rounded-lg p-2"
          value={form[f]}
          onChange={(e) =>
            setForm({ ...form, [f]: e.target.value })
          }
        />
      ))}

      <Button variant="primary">Create Admin</Button>
    </div>
  );
};

export default CreateAdmin;
