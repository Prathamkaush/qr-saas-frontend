"use client";

import { useEffect, useState } from "react";
import { Folder, Plus, MoreVertical, Loader2 } from "lucide-react";

// Define the shape of your Project data
interface Project {
  id: string;
  name: string;
  count?: number; 
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 FIX 1: Use Dynamic API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 🔥 FIX 2: Use API_URL
      const res = await fetch(`${API_URL}/projects/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load projects");

      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    const name = prompt("Enter project name:");
    if (!name) return;

    try {
      const token = localStorage.getItem("token");
      // 🔥 FIX 3: Use API_URL here too
      const res = await fetch(`${API_URL}/projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        fetchProjects(); 
      } else {
        alert("Failed to create project");
      }
    } catch (err) {
      alert("Error creating project");
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    // 🔥 FIX 4: Better mobile padding (p-4 vs p-8)
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      
      {/* Header: Stack on mobile, Row on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">Organize your QR codes into folders</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm w-full sm:w-auto active:scale-95"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6 text-sm">{error}</div>}

      {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Create Shortcut */}
        <button 
          onClick={handleCreate}
          className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all min-h-[160px] active:scale-95"
        >
          <Plus size={32} className="mb-2" />
          <span className="font-medium">Create New Project</span>
        </button>

        {/* Project Cards */}
        {projects.map((project) => (
          <div key={project.id} className="bg-white border hover:border-blue-300 hover:shadow-md transition-all rounded-xl p-5 cursor-pointer group active:scale-95 sm:active:scale-100">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Folder size={24} />
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold mt-4 text-gray-900 truncate">{project.name}</h3>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>{project.count || 0} QR Codes</span>
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}