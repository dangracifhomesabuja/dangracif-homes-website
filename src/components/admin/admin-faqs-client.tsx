"use client";

import * as React from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { FaqItem } from "@/lib/db/entities/FaqItem";
import {
  saveFaqItem,
  deleteFaqItem,
  toggleFaqPublished,
  reorderFaqItems,
} from "@/app/actions/admin-content";
import { ViewToggle } from "./ui/view-toggle";
import { ConfirmModal } from "./ui/confirm-modal";
import { CardSkeletonGrid, ListSkeletonTable } from "./ui/skeleton-loaders";

interface AdminFaqsClientProps {
  initialItems: FaqItem[];
}

export function AdminFaqsClient({ initialItems }: AdminFaqsClientProps) {
  const [items, setItems] = React.useState<FaqItem[]>(initialItems);
  const [view, setView] = React.useState<"card" | "list">("card");
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<"all" | "published" | "draft">("all");
  const isLoading = false;
  const [isArrangeMode, setIsArrangeMode] = React.useState(false);
  const [isReordering, setIsReordering] = React.useState(false);
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);
  const [dropTargetItemId, setDropTargetItemId] = React.useState<string | null>(
    null
  );
  const [originalOrder, setOriginalOrder] = React.useState<FaqItem[] | null>(
    null
  );
  const canReorder = !search.trim() && filterStatus === "all";
  const hasOrderChanges = Boolean(
    originalOrder &&
      items.some((item, index) => item.id !== originalOrder[index]?.id)
  );

  // Edit / Create modal state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<FaqItem | null>(null);
  const [formDraft, setFormDraft] = React.useState<Partial<FaqItem>>({
    question: "",
    answer: "",
    sortOrder: 0,
    published: true,
  });
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = React.useState<FaqItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Accordion preview states in card view
  const [expandedCards, setExpandedCards] = React.useState<Record<string, boolean>>({});

  const toggleCardExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormDraft({
      question: "",
      answer: "",
      sortOrder: items.length,
      published: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item: FaqItem) => {
    setEditingItem(item);
    setFormDraft({
      id: item.id,
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
      published: item.published,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDraft.question?.trim() || !formDraft.answer?.trim()) {
      toast.error("Question and answer are both required");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveFaqItem({
        id: formDraft.id,
        question: formDraft.question.trim(),
        answer: formDraft.answer.trim(),
        sortOrder: formDraft.sortOrder,
        published: formDraft.published,
      });
      if (editingItem) {
        setItems((prev) => prev.map((f) => (f.id === saved.id ? saved : f)));
        toast.success("FAQ updated successfully");
      } else {
        setItems((prev) => [...prev, saved]);
        toast.success("FAQ created successfully");
      }
      setIsFormOpen(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save FAQ"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (item: FaqItem) => {
    try {
      const updated = await toggleFaqPublished(item.id);
      setItems((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      toast.success(
        updated.published ? "FAQ published to website" : "FAQ hidden from website"
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const moveItem = (sourceId: string, targetId: string) => {
    if (!isArrangeMode || sourceId === targetId) return;
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...items];
    const [movedItem] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);
    setItems(reordered);
  };

  const startArrangeMode = () => {
    if (!canReorder) return;
    setOriginalOrder(items);
    setIsArrangeMode(true);
  };

  const cancelArrangeMode = () => {
    if (originalOrder) setItems(originalOrder);
    setOriginalOrder(null);
    setDraggedItemId(null);
    setDropTargetItemId(null);
    setIsArrangeMode(false);
  };

  const saveArrangeMode = async () => {
    if (!hasOrderChanges || isReordering) return;
    setIsReordering(true);
    try {
      await reorderFaqItems(items.map((item) => item.id));
      setItems((current) =>
        current.map((item, sortOrder) => ({ ...item, sortOrder }))
      );
      setOriginalOrder(null);
      setIsArrangeMode(false);
      toast.success("FAQ order saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save FAQ order"
      );
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLElement>,
    itemId: string
  ) => {
    if (!isArrangeMode || isReordering) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", itemId);
    setDraggedItemId(itemId);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDraggedItemId(null);
    setDropTargetItemId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteFaqItem(deleteTarget.id);
      setItems((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      toast.success("FAQ deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === "published") return item.published;
    if (filterStatus === "draft") return !item.published;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              disabled={isArrangeMode}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or answers..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/60 text-xs">
            <button
              type="button"
              disabled={isArrangeMode}
              onClick={() => setFilterStatus("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              disabled={isArrangeMode}
              onClick={() => setFilterStatus("published")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                filterStatus === "published"
                  ? "bg-white text-emerald-700 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              disabled={isArrangeMode}
              onClick={() => setFilterStatus("draft")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                filterStatus === "draft"
                  ? "bg-white text-amber-700 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hidden
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isArrangeMode ? (
            <>
              <button
                type="button"
                onClick={cancelArrangeMode}
                disabled={isReordering}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveArrangeMode()}
                disabled={!hasOrderChanges || isReordering}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReordering && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isReordering ? "Saving order..." : "Save order"}</span>
              </button>
            </>
          ) : (
            <>
              <ViewToggle view={view} onChange={setView} />
              {canReorder && (
                <button
                  type="button"
                  onClick={startArrangeMode}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#0754C6] text-[#0754C6] text-xs font-bold hover:bg-blue-50"
                >
                  <GripVertical className="h-4 w-4" />
                  <span>Rearrange</span>
                </button>
              )}
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold tracking-wide shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isArrangeMode && (
        <p className="text-xs text-slate-500">
          Drag an FAQ card or row to rearrange it, then save or cancel your changes.
        </p>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        view === "card" ? (
          <CardSkeletonGrid count={6} />
        ) : (
          <ListSkeletonTable rows={6} />
        )
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No FAQs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {search
              ? "No questions matched your search criteria."
              : "Add frequent questions about Fidelis Court payment plans, title deeds, and handover dates."}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0754C6] text-white text-xs font-bold hover:bg-[#0648AB] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>
      ) : view === "card" ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              draggable={isArrangeMode && !isReordering}
              onDragStart={(event) => handleDragStart(event, item.id)}
              onDragEnd={() => {
                setDraggedItemId(null);
                setDropTargetItemId(null);
              }}
              onDragOver={(event) => {
                if (
                  isArrangeMode &&
                  draggedItemId &&
                  draggedItemId !== item.id &&
                  dropTargetItemId !== item.id
                ) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTargetItemId(item.id);
                  moveItem(draggedItemId, item.id);
                }
              }}
              onDrop={handleDrop}
              className={`bg-white rounded-lg border transition-all p-5 flex flex-col justify-between group ${
                dropTargetItemId === item.id
                  ? "border-[#0754C6] ring-2 ring-[#0754C6]/20"
                  : "border-slate-200/80 hover:border-slate-300"
              } ${draggedItemId === item.id ? "opacity-50" : ""} ${
                isArrangeMode ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      className={`h-4 w-4 shrink-0 text-slate-400 ${
                        isArrangeMode ? "" : "hidden"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="w-6 h-6 rounded-md bg-blue-50 text-[#00ABF0] flex items-center justify-center text-xs font-bold shrink-0">
                      Q{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.published ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {item.published ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Order #{item.sortOrder ?? 0}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#00ABF0] transition-colors leading-snug">
                  {item.question}
                </h3>

                <div className="mt-3 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                  <p className={expandedCards[item.id] ? "" : "line-clamp-3"}>
                    {item.answer}
                  </p>
                  {item.answer.length > 150 && (
                    <button
                      type="button"
                      onClick={() => toggleCardExpand(item.id)}
                      disabled={isArrangeMode}
                      className="text-[11px] font-bold text-[#00ABF0] hover:underline mt-1.5 cursor-pointer"
                    >
                      {expandedCards[item.id] ? "Show less" : "Read full answer"}
                    </button>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublished(item)}
                  disabled={isArrangeMode}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {item.published ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hide from site</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Show on site</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <GripVertical
                    className={`h-4 w-4 text-slate-400 ${
                      isArrangeMode ? "" : "hidden"
                    }`}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    disabled={isArrangeMode}
                    className="p-1.5 rounded-md text-slate-500 hover:text-[#00ABF0] hover:bg-slate-100 cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    disabled={isArrangeMode}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Question & Answer</th>
                  <th className="py-3 px-4 w-28">Status</th>
                  <th className="py-3 px-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    draggable={isArrangeMode && !isReordering}
                    onDragStart={(event) => handleDragStart(event, item.id)}
                    onDragEnd={() => {
                      setDraggedItemId(null);
                      setDropTargetItemId(null);
                    }}
                    onDragOver={(event) => {
                      if (
                        isArrangeMode &&
                        draggedItemId &&
                        draggedItemId !== item.id &&
                        dropTargetItemId !== item.id
                      ) {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        setDropTargetItemId(item.id);
                        moveItem(draggedItemId, item.id);
                      }
                    }}
                    onDrop={handleDrop}
                    className={`transition-colors ${
                      dropTargetItemId === item.id
                        ? "bg-blue-50 outline outline-2 outline-[#0754C6]/30"
                        : "hover:bg-slate-50/60"
                    } ${draggedItemId === item.id ? "opacity-50" : ""} ${
                      isArrangeMode ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        {isArrangeMode && (
                          <GripVertical className="h-4 w-4 text-slate-400" />
                        )}
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{item.question}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {item.answer}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(item)}
                        disabled={isArrangeMode}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          item.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.published ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {item.published ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {isArrangeMode && (
                          <GripVertical className="h-4 w-4 text-slate-400" />
                        )}
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          disabled={isArrangeMode}
                          className="p-1.5 rounded-md text-slate-500 hover:text-[#00ABF0] hover:bg-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          disabled={isArrangeMode}
                          className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => !isSaving && setIsFormOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#0754C6]/10 text-[#00ABF0] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingItem ? "Edit FAQ Item" : "Add New FAQ Item"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Displayed in the public accordion FAQ section
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isSaving}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formDraft.question || ""}
                  onChange={(e) =>
                    setFormDraft((prev) => ({ ...prev, question: e.target.value }))
                  }
                  placeholder="e.g. Can I customize interior finishes before handover?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formDraft.answer || ""}
                  onChange={(e) =>
                    setFormDraft((prev) => ({ ...prev, answer: e.target.value }))
                  }
                  placeholder="Provide a clear, detailed, and reassuring response..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Priority / Sort Order
                  </label>
                  <input
                    type="number"
                    value={formDraft.sortOrder ?? 0}
                    onChange={(e) =>
                      setFormDraft((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Lower numbers appear first (0, 1, 2...)
                  </p>
                </div>

                <div className="flex flex-col justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Show on Website</p>
                    <p className="text-[10px] text-slate-500">Live on public FAQ</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={formDraft.published ?? true}
                      onChange={(e) =>
                        setFormDraft((prev) => ({
                          ...prev,
                          published: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0754C6]" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Update FAQ" : "Save FAQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete FAQ"
        description="Are you sure you want to remove this question from the website?"
        itemName={deleteTarget?.question}
        confirmText="Delete FAQ"
        isLoading={isDeleting}
      />
    </div>
  );
}
