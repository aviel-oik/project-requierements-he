import { useState } from "react";

type ReportForm = {
  category: string;
  urgency: string;
  message: string;
};

function NewReportPage() {

  const [form, setForm] = useState<ReportForm>({category: "", urgency: "", message: ""});

  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false); // optional

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("category", form.category);
    formData.append("urgency", form.urgency);
    formData.append("message", form.message);

    if (image) {
      formData.append("image", image);
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/reports",{
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      alert("Report submitted!");
      setForm({category: "", urgency: "", message: ""});
      setImage(null);
    } 
    catch (err) {
      alert("Server error");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-report-page">
      <h1>Create Report</h1>

      <form className="new-report-form" onSubmit={handleSubmit}>

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <select
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
          required
        >
          <option value="">Select urgency</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
        />

        <div className="">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <button type="submit" disabled={loading}> {loading ? "Submitting..." : "Submit Report"} </button>
      </form>
    </div>
  );
}

export default NewReportPage;