import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const CreateStudent = () => {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    grade: "",
    nic: "",
    phone: "",
    guardian: ""
  });

  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader
        title="Add Student"
        subtitle="Register a new student"
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

      <Button variant="primary">Save Student</Button>
    </div>
  );
};

export default CreateStudent;
