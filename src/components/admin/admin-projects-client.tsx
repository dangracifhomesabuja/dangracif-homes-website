"use client";

import * as React from "react";
import Image from "next/image";
import {
  Building2,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { saveOtherProjects } from "@/app/actions/admin-content";
import type { OtherProject } from "@/constants/other-projects";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "./ui/confirm-modal";
import { ImageUploader } from "./ui/image-uploader";

type ProjectDraft = Omit<OtherProject, "id">;

const EMPTY_DRAFT: ProjectDraft = {
  title: "",
  description: "",
  location: "",
  status: "Coming soon",
  imageUrl: "",
};

export function AdminProjectsClient({
  initialProjects,
}: {
  initialProjects: OtherProject[];
}) {
  const [projects, setProjects] = React.useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<ProjectDraft>(EMPTY_DRAFT);
  const [isSaving, setIsSaving] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<OtherProject | null>(
    null
  );
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT });
    setIsFormOpen(true);
  };

  const openEditModal = (project: OtherProject) => {
    setEditingId(project.id);
    setDraft({
      title: project.title,
      description: project.description,
      location: project.location,
      status: project.status,
      imageUrl: project.imageUrl,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const project: OtherProject = {
      id: editingId ?? crypto.randomUUID(),
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      location: draft.location.trim(),
      status: draft.status.trim(),
      imageUrl: draft.imageUrl.trim(),
    };
    const nextProjects = editingId
      ? projects.map((item) => (item.id === editingId ? project : item))
      : [...projects, project];

    setIsSaving(true);
    try {
      await saveOtherProjects(nextProjects);
      setProjects(nextProjects);
      setIsFormOpen(false);
      toast.success(editingId ? "Project updated." : "Project added.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save project."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const nextProjects = projects.filter(
      (project) => project.id !== deleteTarget.id
    );

    setIsDeleting(true);
    try {
      await saveOtherProjects(nextProjects);
      setProjects(nextProjects);
      toast.success("Project deleted.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete project."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">
          Add and update the projects shown on the public Other Projects page.
        </p>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[#0754C6] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0648AB]"
        >
          <Plus className="h-4 w-4" />
          Add project
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"
            >
              <div className="relative flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#0754C6]">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-white/70" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="self-start rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0754C6]">
                  {project.status}
                </span>
                <h2 className="mt-3 text-base font-bold text-slate-900">
                  {project.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#00ABF0]" />
                  {project.location}
                </p>
                <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {project.description}
                </p>
                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(project)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No projects added. Add one to feature it on the public page.
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          if (!isSaving) setIsFormOpen(false);
        }}
        title={editingId ? "Edit project" : "Add project"}
        description="Project details will appear on the public Other Projects page."
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
              form="other-project-form"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0754C6] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0648AB] disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save project"}
            </button>
          </>
        }
      >
        <form id="other-project-form" onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-bold text-slate-700">
              Project title
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
              Status
              <input
                type="text"
                value={draft.status}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                placeholder="Coming soon"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                required
              />
            </label>
            <label className="space-y-1.5 text-xs font-bold text-slate-700 sm:col-span-2">
              Description
              <textarea
                rows={4}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-[#0754C6] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20"
                required
              />
            </label>
            <div className="sm:col-span-2">
              <ImageUploader
                label="Project image (optional)"
                value={draft.imageUrl}
                folder="other-projects"
                onChange={(url) =>
                  setDraft((current) => ({ ...current, imageUrl: url }))
                }
              />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        itemName={deleteTarget?.title || "Untitled project"}
        isLoading={isDeleting}
      />
    </div>
  );
}
