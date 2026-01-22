import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  Building2,
  Pencil,
  Save,
  X,
  Power,
  Ban,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

export default function Organizations() {
  const [orgs, setOrgs] = useState([]);

  /* CREATE */
  const [name, setName] = useState("");
  const [orgQboItemName, setOrgQboItemName] = useState("");
  const [invoiceMemo, setInvoiceMemo] = useState("");

  /* EDIT */
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingQboName, setEditingQboName] = useState("");
  const [editingInvoiceMemo, setEditingInvoiceMemo] = useState("");

  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  const loadOrgs = () => {
    api.get("/organizations").then((res) => setOrgs(res.data));
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  /* ---------- CREATE ---------- */
  const createOrg = async (e) => {
    e.preventDefault();
    if (loadingAction) return;

    setLoadingAction("create");
    setError("");

    try {
      await api.post("/organizations", {
        name,
        orgQboItemName,
        invoiceMemo,
      });

      toast.success("Organization created successfully");
      setName("");
      setOrgQboItemName("");
      setInvoiceMemo("");
      loadOrgs();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoadingAction(null);
    }
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    if (loadingAction) return;

    setLoadingAction(`save-${id}`);
    try {
      await api.put(`/organizations/${id}`, {
        name: editingName,
        orgQboItemName: editingQboName,
        invoiceMemo: editingInvoiceMemo,
      });

      toast.success("Organization updated");
      setEditingId(null);
      loadOrgs();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoadingAction(null);
    }
  };

  /* ---------- ACTIVATE ---------- */
  const changeActive = async (id) => {
    if (loadingAction) return;
    setLoadingAction(`active-${id}`);
    try {
      await api.patch(`/organizations/${id}/active`);
      toast.success("Organization status updated");
      loadOrgs();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingAction(null);
    }
  };

  /* ---------- SUSPEND ---------- */
  const changeSuspend = async (id) => {
    if (loadingAction) return;
    setLoadingAction(`suspend-${id}`);
    try {
      await api.patch(`/organizations/${id}/suspend`);
      toast.success("Suspension status updated");
      loadOrgs();
    } catch {
      toast.error("Failed to update suspension");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Organizations</h1>
        <p className="text-gray-500 mt-1">
          Manage organizations and QuickBooks configuration
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* CREATE */}
      <form
        onSubmit={createOrg}
        className="bg-white rounded-2xl shadow-lg border p-6 max-w-lg space-y-4"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Building2 size={18} />
          Create Organization
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organization name"
          className="w-full rounded-lg border px-3 py-2"
          required
        />

        <input
          value={orgQboItemName}
          onChange={(e) => setOrgQboItemName(e.target.value)}
          placeholder="QBO Customer Name"
          className="w-full rounded-lg border px-3 py-2"
          required
        />

        <textarea
          value={invoiceMemo}
          onChange={(e) => setInvoiceMemo(e.target.value)}
          placeholder="Invoice Memo (appears on QuickBooks invoice)"
          rows={3}
          className="w-full rounded-lg border px-3 py-2"
        />

        <button
          disabled={loadingAction === "create"}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loadingAction === "create" ? "Adding…" : "Add Organization"}
        </button>
      </form>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Organization</th>
              <th className="px-4 py-3 text-left">QBO Customer</th>
              <th className="px-4 py-3 text-left">Invoice Memo</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orgs.map((o) => {
              const isEditing = editingId === o._id;

              return (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      o.name
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editingQboName}
                        onChange={(e) => setEditingQboName(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      o.orgQboItemName
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {isEditing ? (
                      <textarea
                        value={editingInvoiceMemo}
                        onChange={(e) => setEditingInvoiceMemo(e.target.value)}
                        rows={2}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <span className="text-gray-500">
                        {o.invoiceMemo || "—"}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {o.active ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-400">Inactive</span>
                    )}
                  </td>

                  <td className="px-4 py-3 space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(o._id)}
                          className="text-green-600 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(o._id);
                          setEditingName(o.name);
                          setEditingQboName(o.orgQboItemName);
                          setEditingInvoiceMemo(o.invoiceMemo || "");
                        }}
                        className="text-blue-600 font-semibold"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
