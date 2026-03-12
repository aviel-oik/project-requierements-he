import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

function CsvUploadPage() {

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Select a CSV file");
      return;
    }
    const formData = new FormData();
    formData.append("csv", file);
    await fetch("http://localhost:3000/reports/csv", {
      method: "POST",
      body: formData,
    });
    alert("File uploaded!");
  };

  return (
    <div className="csv-upload-page">
      <h1>Upload CSV</h1>
      <form onSubmit={handleSubmit} >
        <input type="file" accept=".csv" placeholder="choose a csv file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default CsvUploadPage