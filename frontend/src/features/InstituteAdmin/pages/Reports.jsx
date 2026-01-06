import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import { storage } from "../services/storage";
import { downloadCSV, downloadPDFViaPrint } from "../services/exporters";

const Reports = () => {
  const [search, setSearch] = useState("");

  const reports = storage.getReports();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      return (
        !q ||
        r.classLabel.toLowerCase().includes(q) ||
        r.teacher.toLowerCase().includes(q) ||
        r.date.toLowerCase().includes(q) ||
        r.adminId.toLowerCase().includes(q)
      );
    });
  }, [search, reports]);

  const exportReportCSV = (report) => {
    const headers = [
      "Student ID",
      "Name",
      "NIC",
      "Phone",
      "Attendance",
      "Payment",
      "Payment DateTime"
    ];

    const rows = report.rows.map((x) => [
      x.studentId,
      x.name,
      x.nic,
      x.phone,
      x.present,
      x.paymentDone,
      x.paymentDateTime
    ]);

    downloadCSV(
      `${report.id}_${report.grade}_${report.subject}_${report.date}_${report.time}`,
      headers,
      rows
    );
  };

  const exportReportPDF = (report) => {
    const meta = `
      <h1>Attendance Report</h1>
      <div class="meta">
        <div><b>Class:</b> ${report.classLabel}</div>
        <div><b>Teacher:</b> ${report.teacher}</div>
        <div><b>Date & Time:</b> ${report.date} ${report.time}</div>
        <div><b>Admin:</b> ${report.adminName} (${report.adminId})</div>
        <div class="muted"><b>Report ID:</b> ${report.id}</div>
      </div>
    `;

    const rowsHtml = report.rows
      .map(
        (r) => `
          <tr>
            <td>${r.studentId}</td>
            <td>${r.name}</td>
            <td>${r.nic}</td>
            <td>${r.phone}</td>
            <td>${r.present}</td>
            <td>${r.paymentDone}</td>
            <td>${r.paymentDateTime}</td>
          </tr>
        `
      )
      .join("");

    const table = `
      <h2>Students</h2>
      <table>
        <thead>
          <tr>
            <th>Student ID</th><th>Name</th><th>NIC</th><th>Phone</th>
            <th>Attendance</th><th>Payment</th><th>Payment DateTime</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;

    downloadPDFViaPrint(`Attendance_Report_${report.id}`, meta + table);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reports"
        subtitle="Generated attendance reports. Download as CSV or PDF."
      />

      <Toolbar search={search} setSearch={setSearch} />

      <DataTable
        keyField="id"
        columns={[
          { key: "id", label: "Report ID" },
          { key: "classLabel", label: "Class" },
          { key: "teacher", label: "Teacher" },
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
          { key: "adminId", label: "Admin ID" },
          {
            key: "download",
            label: "Download",
            render: (r) => (
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => exportReportCSV(r)}>CSV</Button>
                <Button variant="secondary" onClick={() => exportReportPDF(r)}>PDF</Button>
              </div>
            )
          }
        ]}
        rows={filtered}
        emptyTitle="No reports yet"
        emptyDescription="Submit attendance to generate reports."
      />
    </div>
  );
};

export default Reports;
