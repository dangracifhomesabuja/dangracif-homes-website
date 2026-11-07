"use client";

import * as React from "react";
import Link from "next/link";
import {
  Edit3,
  Save,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getPropertyUnitsList,
  updatePropertyUnitAction,
} from "@/app/actions/admin-dashboard";
import { PropertyUnit } from "@/lib/db/entities/PropertyUnit";
import { ViewToggle } from "./ui/view-toggle";
import { CustomSelect } from "@/components/ui/custom-select";

interface AdminUnitsClientProps {
  initialUnits: PropertyUnit[];
}

export function AdminUnitsClient({ initialUnits }: AdminUnitsClientProps) {
  const [units, setUnits] = React.useState<PropertyUnit[]>(initialUnits);
  const [editingUnitId, setEditingUnitId] = React.useState<string | null>(null);
  const [unitForm, setUnitForm] = React.useState<Partial<PropertyUnit>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getPropertyUnitsList();
      setUnits(fresh);
      toast.success("Estate inventory refreshed");
    } catch {
      toast.error("Failed to refresh units");
    } finally {
      setIsRefreshing(false);
    }
  };

  const startEdit = (unit: PropertyUnit) => {
    setEditingUnitId(unit.id);
    setUnitForm({
      price: unit.price,
      availableUnits: unit.availableUnits,
      unitsCount: unit.unitsCount,
      status: unit.status,
      description: unit.description,
    });
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    try {
      const result = await updatePropertyUnitAction(id, unitForm);
      setUnits((curr) =>
        curr.map((unit) =>
          unit.id === id ? { ...unit, ...result.unit } : unit
        )
      );
      setEditingUnitId(null);
      toast.success("Unit details updated successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update unit details"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case "limited":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Limited Units
          </span>
        );
      case "sold_out":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Sold Out
          </span>
        );
      default:
        return (
          <span className="text-[11px] uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const [view, setView] = React.useState<"card" | "list">("card");

  return (
    <div className="space-y-8">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
        <div>
          <p className="text-xs text-slate-500">Live pricing and stock availability</p>
        </div>

        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />

          <Link
            href="/fideliscourt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#00ABF0] text-xs font-semibold shadow-2xs transition-all"
          >
            <span>Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Units View (Card or List) */}
      {view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => {
            const isEditing = editingUnitId === unit.id;
            const availablePct = Math.round(
              (unit.availableUnits / (unit.unitsCount || 1)) * 100
            );

            return (
              <div
                key={unit.id}
                className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div className="p-6 space-y-4">
                  {/* Header with Title and Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-mono text-[#00ABF0] uppercase tracking-wider font-semibold">
                        ID: {unit.id}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {unit.title}
                      </h3>
                    </div>
                    {getStatusBadge(unit.status)}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {unit.description}
                  </p>

                  {/* Edit Form or Read-Only State */}
                  {isEditing ? (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Price Display String
                        </label>
                        <input
                          type="text"
                          value={unitForm.price ?? unit.price}
                          onChange={(e) =>
                            setUnitForm((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          className="w-full p-2.5 rounded-md border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Available Units
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={unitForm.unitsCount ?? unit.unitsCount}
                            step={1}
                            value={
                              unitForm.availableUnits ?? unit.availableUnits
                            }
                            onChange={(e) =>
                              setUnitForm((prev) => ({
                                ...prev,
                                availableUnits: Number(e.target.value),
                              }))
                            }
                            className="w-full p-2.5 rounded-md border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Total Units
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={unitForm.unitsCount ?? unit.unitsCount}
                            onChange={(e) =>
                              setUnitForm((prev) => ({
                                ...prev,
                                unitsCount: Number(e.target.value),
                              }))
                            }
                            className="w-full p-2.5 rounded-md border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Inventory Status
                        </label>
                        <CustomSelect
                          value={unitForm.status ?? unit.status}
                          onChange={(status) =>
                            setUnitForm((prev) => ({
                              ...prev,
                              status,
                            }))
                          }
                          options={[
                            { value: "available", label: "Available" },
                            { value: "limited", label: "Limited" },
                            { value: "sold_out", label: "Sold Out" },
                          ]}
                          triggerClassName="h-10 rounded-md px-2.5 text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingUnitId(null)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(unit.id)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      {/* Price and Availability Chips */}
                      <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">
                          Current Listing Price:
                        </span>
                        <span className="text-xl font-extrabold text-[#00ABF0]">
                          {unit.price}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">
                            {unit.availableUnits} Available
                          </span>
                          <span className="text-slate-400">
                            Total {unit.unitsCount} Units
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              availablePct > 30
                                ? "bg-emerald-500"
                                : availablePct > 0
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${Math.max(5, availablePct)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => startEdit(unit)}
                        className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-[#0754C6] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                        <span>Edit Unit Pricing &amp; Stock</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Unit Type</th>
                <th className="py-3 px-4">Listing Price</th>
                <th className="py-3 px-4">Available / Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{unit.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {unit.id}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#00ABF0]">
                    {unit.price}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">
                      {unit.availableUnits}
                    </span>{" "}
                    / <span className="text-slate-400">{unit.unitsCount}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(unit.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setView("card");
                        startEdit(unit);
                      }}
                      className="p-1.5 rounded-md text-slate-500 hover:text-[#00ABF0] hover:bg-slate-100 cursor-pointer"
                      title="Edit Stock & Pricing"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
