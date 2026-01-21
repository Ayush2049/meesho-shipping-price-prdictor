"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateImages } from "../modules/image/services/image.api";
import "@/styles/layout/page.layout.css";
import "@/styles/design/page.design.css";

export default function Page() {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleGenerate = async () => {
    if (!category || !file) {
      alert("Category and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("image", file);

    setLoading(true);
    try {
      const result = await generateImages(formData);
      sessionStorage.setItem("results", JSON.stringify(result));
      router.push("/generate");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to generate images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <h1>Low Shipping Image Optimizer</h1>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="tshirt">T-Shirt</option>
        <option value="dress">Dress</option>
        <option value="footwear">Footwear</option>
        <option value="home">Home / Kitchen</option>
      </select>

      <input
        type="file"
        accept="image/jpeg"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Optimizing…" : "Generate"}
      </button>
    </main>
  );
}
