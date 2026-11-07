"use client";

import * as React from "react";
import {
  BriefcaseBusiness,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Save,
  Trash2,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { saveCareerOpenings } from "@/app/actions/admin-content";
import type { CareerOpening } from "@/constants/careers";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "./ui/confirm-modal";

type CareerDraft = Omit<CareerOpening, "id">;

const EMPTY_DRAFT: CareerDraft = {
  title: "",
  description: "",
  employmentType: "Full-time",
  location: "Abuja, Nigeria",
};

export function AdminCareersClient({
  initialOpenings,
}: {
  initialOpenings: CareerOpening[];
}) {
  const [openings, setOpenings] = React.useState(initialOpenings);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<CareerDraft>(EMPTY_DRAFT);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isArrangeMode, setIsArrangeMode] = React.useState(false);
  const [isReordering, setIsReordering] = React.useState(false);
  const [draggedOpeningId, setDraggedOpeningId] = React.useState<string | null>(
    null
  );
  const [dropTargetOpeningId, setDropTargetOpeningId] = React.useState<
    string | null
  >(null);
  const [originalOrder, setOriginalOrder] = React.useState<
    CareerOpening[] | null
  >(null);
  const hasOrderChanges = Boolean(
    originalOrder &&
      openings.some((opening, index) => opening.id !== originalOrder[index]?.id)
  );
  const [deleteTarget, setDeleteTarget] =
    React.useState<CareerOpening | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT });
    setIsFormOpen(true);
  };

  const openEditModal = (opening: CareerOpening) => {
    setEditingId(opening.id);
    setDraft({
      title: opening.title,
      description: opening.description,
      employmentType: opening.employmentType,
      location: opening.location,
    });
    setIsFormOpen(true);
  };

  const moveOpening = (sourceId: string, targetId: string) => {
    if (!isArrangeMode || sourceId === targetId) return;
    const sourceIndex = openings.findIndex((opening) => opening.id === sourceId);
    const targetIndex = openings.findIndex((opening) => opening.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...openings];
    const [opening] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, opening);
    setOpenings(reordered);
  };

  const startArrangeMode = () => {
    setOriginalOrder(openings);
    setIsArrangeMode(true);
  };

  const cancelArrangeMode = () => {
    if (originalOrder) setOpenings(originalOrder);
    setOriginalOrder(null);
    setDraggedOpeningId(null);
    setDropTargetOpeningId(null);
    setIsArrangeMode(false);
  };

  const saveArrangeMode = async () => {
    if (!hasOrderChanges || isReordering) return;
    setIsReordering(true);
    try {
      await saveCareerOpenings(openings);
      setOriginalOrder(null);
      setIsArrangeMode(false);
      toast.success("Career opening order saved.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save career opening order."
      );
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLElement>,
    openingId: string
  ) => {
    if (!isArrangeMode || isReordering) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", openingId);
    setDraggedOpeningId(openingId);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDraggedOpeningId(null);
    setDropTargetOpeningId(null);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const opening: CareerOpening = {
      id: editingId ?? crypto.randomUUID(),
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      employmentType: draft.employmentType.trim(),
      location: draft.location.trim(),
    };
    const nextOpenings = editingId
      ? openings.map((item) => (item.id === editingId ? opening : item))
      : [...openings, opening];

    setIsSaving(true);
    try {
      await saveCareerOpenings(nextOpenings);
      setOpenings(nextOpenings);
      setIsFormOpen(false);
      toast.success(editingId ? "Career opening updated." : "Career opening added.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save career opening."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const nextOpenings = openings.filter(
      (opening) => opening.id !== deleteTarget.id
    );

    setIsDeleting(true);
    try {
      await saveCareerOpenings(nextOpenings);
      setOpenings(nextOpenings);
      setDeleteTarget(null);
      toast.success("Career opening deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete career opening."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">
          Add, update, or remove the roles shown on the public Careers page.
        </p>
        <div className="flex flex-wrap gap-2">
          {isArrangeMode ? (
            <>
              <button
                type="button"
                onClick={cancelArrangeMode}
                disabled={isReordering}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveArrangeMode()}
                disabled={!hasOrderChanges || isReordering}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0754C6] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0648AB] disabled:opacity-50"
              >
                {isReordering && <Loader2 className="h-4 w-4 animate-spin" />}
                {isReordering ? "Saving order..." : "Save order"}
              </button>
            </>
          ) : (
            <>
              {openings.length > 1 && (
                <button
                  type="button"
                  onClick={startArrangeMode}
                  className="inline-flex items-center gap-2 self-start rounded-lg border border-[#0754C6] px-4 py-2.5 text-xs font-bold text-[#0754C6] hover:bg-blue-50"
                >
                  <GripVertical className="h-4 w-4" />
                  Rearrange
                </button>
              )}
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 self-start rounded-lg bg-[#0754C6] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0648AB]"
              >
                <Plus className="h-4 w-4" />
                Add opening
              </button>
            </>
          )}
        </div>
      </div>

      {isArrangeMode && (
        <p className="text-xs text-slate-500">
          Drag a career card to change its position, then save or cancel your changes.
        </p>
      )}

      {openings.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {openings.map((opening) => (
            <article
              key={opening.id}
              draggable={isArrangeMode && !isReordering}
              onDragStart={(event) => handleDragStart(event, opening.id)}
              onDragEnd={() => {
                setDraggedOpeningId(null);
                setDropTargetOpeningId(null);
              }}
              onDragOver={(event) => {
                if (
                  isArrangeMode &&
                  draggedOpeningId &&
                  draggedOpeningId !== opening.id &&
                  dropTargetOpeningId !== opening.id
                ) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTargetOpeningId(opening.id);
                  moveOpening(draggedOpeningId, opening.id);
                }
              }}
              onDrop={handleDrop}
              className={`flex flex-col rounded-xl border bg-white p-5 shadow-2xs ${
                dropTargetOpeningId === opening.id
                  ? "border-[#0754C6] ring-2 ring-[#0754C6]/20"
                  : "border-slate-200"
              } ${draggedOpeningId === opening.id ? "opacity-50" : ""} ${
                isArrangeMode ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <GripVertical
                  className={`mt-1 h-4 w-4 shrink-0 text-slate-400 ${
                    isArrangeMode ? "" : "hidden"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0754C6]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900">{opening.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {opening.employmentType}
                  </p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#00ABF0]" />
                {opening.location}
              </p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {opening.description}
              </p>
              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => openEditModal(opening)}
                  disabled={isArrangeMode}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(opening)}
                  disabled={isArrangeMode}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No career openings. Add one to show it on the public Careers page.
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!isSaving) setIsFormOpen(false);
        }}
        title={editingId ? "Edit career opening" : "Add career opening"}
        description="These details will appear on the public Careers page."
        maxWidth="xl"
        className="max-h-[90vh] overflow-y-auto"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={isSaving}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="career-opening-form"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0754C6] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0648AB] disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save opening"}
            </button>
          </>
        }
      >
        <form
          id="career-opening-form"
          onSubmit={handleSave}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-bold text-slate-700 sm:col-span-2">
              Job title
              <input
                type="text"
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                required
              />
            </label>
            <label className="space-y-1.5 text-xs font-bold text-slate-700">
              Employment type
              <input
                type="text"
                value={draft.employmentType}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    employmentType: event.target.value,
                  }))
                }
                placeholder="Full-time, contract, internship..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                required
              />
            </label>
            <label className="space-y-1.5 text-xs font-bold text-slate-700">
              Location
              <input
                type="text"
                value={draft.location}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                required
              />
            </label>
            <label className="space-y-1.5 text-xs font-bold text-slate-700 sm:col-span-2">
              Job description
              <textarea
                rows={10}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder={"Describe the role, qualifications, responsibilities, and requirements."}
                className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                required
              />
            </label>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Career Opening"
        description="Are you sure you want to delete this job opening? This action cannot be undone."
        itemName={deleteTarget?.title || "Untitled opening"}
        isLoading={isDeleting}
      />
    </div>
  );
}
