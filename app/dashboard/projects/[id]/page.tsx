"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetails() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [qrs, setQrs] = useState<any[]>([]);
  const [availableQRs, setAvailableQRs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  // ----------------------------------------------------
  // LOAD PROJECT + QRs
  // ----------------------------------------------------
  async function loadData() {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      const [res1, res2] = await Promise.all([
        fetch(`${API_URL}/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/projects/${id}/qr`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const projectData = await res1.json();
      const qrData = await res2.json();

      setProject(projectData);
      setQrs(Array.isArray(qrData) ? qrData : []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  // ----------------------------------------------------
  // LOAD QRs NOT IN THIS PROJECT (FOR ADD MODAL)
  // ----------------------------------------------------
  async function loadAvailableQRs() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/qr/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to load QRs");

    const all = await res.json();

    const filtered = all.filter((qr: any) => qr.project_id !== id);
    setAvailableQRs(filtered);
  } catch (err) {
    console.error("QR LOAD ERROR:", err);
  }
}

  // ----------------------------------------------------
  // REMOVE QR
  // ----------------------------------------------------
  async function handleRemove(qrID: string) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/projects/${id}/remove/${qrID}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setQrs((prev) => prev.filter((q) => q.id !== qrID));
  }

  // ----------------------------------------------------
  // ADD QR
  // ----------------------------------------------------
  async function handleAdd(qrID: string) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/projects/${id}/add/${qrID}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowAddModal(false);
    loadData();
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* ----------------------------------------------------
         HEADER
      ---------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <button className="p-2 bg-white border rounded-full hover:bg-gray-100 shadow-sm">
              <ArrowLeft size={20} />
            </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {project?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Manage QR codes inside this project
            </p>
          </div>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => {
            loadAvailableQRs();
            setShowAddModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add QR
        </button>
      </div>

      {/* ----------------------------------------------------
         QR GRID
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {qrs.length === 0 && (
          <p className="text-gray-500 text-center col-span-full mt-6">
            No QRs in this folder.
          </p>
        )}

        {qrs.map((qr) => (
          <div
            key={qr.id}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-lg">{qr.name}</h3>
            <p className="text-xs text-gray-500 mt-1 uppercase">{qr.qr_type}</p>

            <div className="flex items-center justify-between mt-4">
              <Link
                href={`/dashboard/qr/${qr.id}/edit`}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </Link>

              <button
                onClick={() => handleRemove(qr.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------
         ADD QR MODAL
      ---------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add QR to Project</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={22} className="text-gray-600 hover:text-black" />
              </button>
            </div>

            {availableQRs.length === 0 ? (
              <p className="text-gray-500">No available QRs.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {availableQRs.map((qr) => (
                  <div
                    key={qr.id}
                    className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <span>{qr.name}</span>

                    <button
                      onClick={() => handleAdd(qr.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full py-2 bg-gray-100 rounded-lg mt-2 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
