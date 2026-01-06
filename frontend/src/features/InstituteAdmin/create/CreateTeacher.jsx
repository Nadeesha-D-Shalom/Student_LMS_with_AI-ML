import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const CreateTeacher = () => {
  const [form, setForm] = useState({
    name: "",
    teacherId: "",
    subject: "",
    phone: "",
    qualification: ""
  });

  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader
        title="Add Teacher"
        subtitle="Register a new teacher"
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

      <Button variant="primary">Save Teacher</Button>
    </div>
  );
};

export default CreateTeacher;
