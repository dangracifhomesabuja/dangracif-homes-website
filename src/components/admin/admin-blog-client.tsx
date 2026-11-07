"use client";

import * as React from "react";
import Image from "next/image";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { BlogPost } from "@/lib/db/entities/BlogPost";
import {
  saveBlogPost,
  deleteBlogPost,
  toggleBlogPostPublished,
  reorderBlogPosts,
} from "@/app/actions/admin-content";
import { ViewToggle } from "./ui/view-toggle";
import { ConfirmModal } from "./ui/confirm-modal";
import { ImageUploader } from "./ui/image-uploader";
import { BlogRichTextEditor } from "./ui/blog-rich-text-editor";
import {
  DatePicker,
  formatDatePickerValue,
  parseDatePickerValue,
} from "@/components/ui/date-picker";

interface AdminBlogClientProps {
  initialPosts: BlogPost[];
}

export function AdminBlogClient({ initialPosts }: AdminBlogClientProps) {
  const [posts, setPosts] = React.useState<BlogPost[]>(initialPosts);
  const [view, setView] = React.useState<"card" | "list">("card");
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<"all" | "published" | "draft">("all");

  // Modal states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [formDraft, setFormDraft] = React.useState<Partial<BlogPost>>({
    title: "",
    summary: "",
    expandedContent: "",
    imageSrc: "",
    imageAlt: "",
    imageCaption: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    linkText: "",
    linkHref: "",
    published: true,
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [isImageUploading, setIsImageUploading] = React.useState(false);
  const [isContentImageUploading, setIsContentImageUploading] =
    React.useState(false);
  const isUploadPending = isImageUploading || isContentImageUploading;
  const [isReordering, setIsReordering] = React.useState(false);
  const [isArrangeMode, setIsArrangeMode] = React.useState(false);
  const [draggedPostId, setDraggedPostId] = React.useState<string | null>(null);
  const [dropTargetPostId, setDropTargetPostId] = React.useState<string | null>(
    null
  );
  const [originalOrder, setOriginalOrder] = React.useState<BlogPost[] | null>(
    null
  );
  const canReorder =
    !search.trim() &&
    filterStatus === "all" &&
    posts.every((post) => post.sortOrder >= 0);
  const hasOrderChanges = Boolean(
    originalOrder &&
      posts.some((post, index) => post.id !== originalOrder[index]?.id)
  );

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = React.useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormDraft({
      title: "",
      summary: "",
      expandedContent: "",
      imageSrc: "",
      imageAlt: "",
      imageCaption: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      linkText: "",
      linkHref: "",
      published: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormDraft({
      id: post.id,
      title: post.title,
      summary: post.summary,
      expandedContent: post.expandedContent,
      imageSrc: post.imageSrc,
      imageAlt: post.imageAlt,
      imageCaption: post.imageCaption,
      date: post.date,
      linkText: post.linkHref === "#" ? "" : post.linkText,
      linkHref: post.linkHref === "#" ? "" : post.linkHref,
      published: post.published,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadPending) {
      toast.error("Wait for all article images to finish uploading before saving.");
      return;
    }
    if (!formDraft.title?.trim()) {
      toast.error("Article title is required");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveBlogPost({
        id: formDraft.id,
        title: formDraft.title.trim(),
        summary: formDraft.summary,
        expandedContent: formDraft.expandedContent,
        imageSrc: formDraft.imageSrc,
        imageAlt: formDraft.imageAlt,
        imageCaption: formDraft.imageCaption,
        date: formDraft.date,
        linkText: formDraft.linkText,
        linkHref: formDraft.linkHref,
        published: formDraft.published,
      });
      if (editingPost) {
        setPosts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        toast.success("Blog article updated");
      } else {
        setPosts((prev) => [...prev, saved]);
        toast.success("Blog article published");
      }
      setIsFormOpen(false);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save article"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const updated = await toggleBlogPostPublished(post.id);
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(
        updated.published ? "Article published to website" : "Article moved to drafts"
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const movePost = (sourceId: string, targetId: string) => {
    if (!isArrangeMode || sourceId === targetId) return;
    const sourceIndex = posts.findIndex((post) => post.id === sourceId);
    const targetIndex = posts.findIndex((post) => post.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...posts];
    const [movedPost] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedPost);
    setPosts(reordered);
  };

  const startArrangeMode = () => {
    if (!canReorder) return;
    setOriginalOrder(posts);
    setIsArrangeMode(true);
  };

  const cancelArrangeMode = () => {
    if (originalOrder) setPosts(originalOrder);
    setOriginalOrder(null);
    setDraggedPostId(null);
    setDropTargetPostId(null);
    setIsArrangeMode(false);
  };

  const saveArrangeMode = async () => {
    if (!hasOrderChanges || isReordering) return;
    setIsReordering(true);
    try {
      await reorderBlogPosts(posts.map((post) => post.id));
      setOriginalOrder(null);
      setIsArrangeMode(false);
      toast.success("Blog order saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save blog order"
      );
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLElement>,
    postId: string
  ) => {
    if (!isArrangeMode || isReordering) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", postId);
    setDraggedPostId(postId);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDraggedPostId(null);
    setDropTargetPostId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlogPost(deleteTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Article deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === "published") return post.published;
    if (filterStatus === "draft") return !post.published;
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
              placeholder="Search articles by title or summary..."
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
              All ({posts.length})
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
              Published
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
              Drafts
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
                <span>New Article</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!canReorder && !isArrangeMode && (
        <p className="text-xs text-slate-500">
          {search.trim() || filterStatus !== "all"
            ? "Clear search and select All to rearrange articles."
            : "Apply the blog ordering database migration to enable rearrangement."}
        </p>
      )}
      {isArrangeMode && (
        <p className="text-xs text-slate-500">
          Drag an article card or row to rearrange it, then save or cancel your changes.
        </p>
      )}

      {/* Main Content Area */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No blog articles found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {search
              ? "No articles matched your search query. Try clearing the filter."
              : "Get started by publishing your first article for the Fidelis Court website."}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0754C6] text-white text-xs font-bold hover:bg-[#0648AB] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      ) : view === "card" ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            return (
            <div
              key={post.id}
              draggable={isArrangeMode && !isReordering}
              onDragStart={(event) => handleDragStart(event, post.id)}
              onDragEnd={() => {
                setDraggedPostId(null);
                setDropTargetPostId(null);
              }}
              onDragOver={(event) => {
                if (isArrangeMode && draggedPostId && draggedPostId !== post.id) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTargetPostId(post.id);
                  movePost(draggedPostId, post.id);
                }
              }}
              onDrop={handleDrop}
              className={`bg-white rounded-lg border hover:shadow-md transition-all flex flex-col overflow-hidden group ${
                dropTargetPostId === post.id
                  ? "border-[#0754C6] ring-2 ring-[#0754C6]/20"
                  : "border-slate-200/80 hover:border-slate-300"
              } ${draggedPostId === post.id ? "opacity-50" : ""} ${
                isArrangeMode ? "cursor-grab active:cursor-grabbing" : ""
              }`}
            >
              {/* Card Image */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {post.imageSrc ? (
                  <Image
                    src={post.imageSrc}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <FileText className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[11px]">No cover image</span>
                  </div>
                )}

                {/* Published Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md shadow-2xs ${
                      post.published
                        ? "bg-emerald-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Date Badge */}
                {post.date && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#00ABF0] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.summary || "No summary provided."}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(post)}
                    disabled={isArrangeMode}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                    title={post.published ? "Unpublish to draft" : "Publish to site"}
                  >
                    {post.published ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Publish</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <span
                      className={`p-1.5 rounded-md text-slate-500 ${
                        isArrangeMode ? "" : "hidden"
                      }`}
                      aria-hidden="true"
                      title="Drag the card to rearrange"
                    >
                      <GripVertical className="w-4 h-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(post)}
                      disabled={isArrangeMode}
                      className="p-1.5 rounded-md text-slate-500 hover:text-[#00ABF0] hover:bg-slate-100 cursor-pointer transition-colors"
                      title="Edit Article"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(post)}
                      disabled={isArrangeMode}
                      className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => {
                return (
                <tr
                  key={post.id}
                  draggable={isArrangeMode && !isReordering}
                  onDragStart={(event) => handleDragStart(event, post.id)}
                  onDragEnd={() => {
                    setDraggedPostId(null);
                    setDropTargetPostId(null);
                  }}
                  onDragOver={(event) => {
                    if (isArrangeMode && draggedPostId && draggedPostId !== post.id) {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDropTargetPostId(post.id);
                      movePost(draggedPostId, post.id);
                    }
                  }}
                  onDrop={handleDrop}
                  className={`transition-colors ${
                    dropTargetPostId === post.id
                      ? "bg-blue-50 outline outline-2 outline-[#0754C6]/30"
                      : "hover:bg-slate-50/60"
                  } ${draggedPostId === post.id ? "opacity-50" : ""} ${
                    isArrangeMode ? "cursor-grab active:cursor-grabbing" : ""
                  }`}
                >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-md bg-slate-100 overflow-hidden shrink-0">
                          {post.imageSrc ? (
                            <Image
                              src={post.imageSrc}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-md">
                            {post.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-md">
                            {post.summary}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {post.date || "—"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(post)}
                        disabled={isArrangeMode}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                          post.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.published ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <span
                          className={`p-1.5 rounded-md text-slate-500 ${
                            isArrangeMode ? "" : "hidden"
                          }`}
                          aria-hidden="true"
                          title="Drag the row to rearrange"
                        >
                          <GripVertical className="w-4 h-4" />
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditModal(post)}
                          disabled={isArrangeMode}
                          className="p-1.5 rounded-md text-slate-500 hover:text-[#00ABF0] hover:bg-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(post)}
                          disabled={isArrangeMode}
                          className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL DRAWER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() =>
              !isSaving && !isUploadPending && setIsFormOpen(false)
            }
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#0754C6]/10 text-[#00ABF0] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingPost ? "Edit Blog Article" : "Create New Blog Article"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Displayed on the public website under Insights & Updates
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isSaving || isUploadPending}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formDraft.title || ""}
                  onChange={(e) =>
                    setFormDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. Why Fidelis Court is Abuja's Premier Smart Estate"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <DatePicker
                    label="Display Date"
                    value={parseDatePickerValue(formDraft.date || "")}
                    onChange={(date) =>
                      setFormDraft((prev) => ({
                        ...prev,
                        date: formatDatePickerValue(date, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }),
                      }))
                    }
                    minDate={new Date(1900, 0, 1)}
                    placeholder="Select a display date"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Link Label
                  </label>
                  <input
                    type="text"
                    maxLength={255}
                    value={formDraft.linkText || ""}
                    onChange={(e) =>
                      setFormDraft((prev) => ({ ...prev, linkText: e.target.value }))
                    }
                    placeholder="e.g. Learn more"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                  />
                  <p className="mt-1 text-[10px] font-normal text-slate-500">
                    Add both a label and URL to show a link on the published card.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Link URL
                </label>
                <input
                  type="text"
                  maxLength={500}
                  value={formDraft.linkHref || ""}
                  onChange={(e) =>
                    setFormDraft((prev) => ({ ...prev, linkHref: e.target.value }))
                  }
                  placeholder="https://example.com or /contact"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white"
                />
              </div>

              {/* Cloudinary Image Uploader */}
              <ImageUploader
                value={formDraft.imageSrc}
                onChange={(url) =>
                  setFormDraft((prev) => ({ ...prev, imageSrc: url }))
                }
                onUploadStateChange={setIsImageUploading}
                folder="blog"
                label="Cover Image"
                hint="PNG, JPG, WebP, or GIF up to 10MB, or paste a Cloudinary/site URL."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formDraft.imageAlt || ""}
                    onChange={(e) =>
                      setFormDraft((prev) => ({ ...prev, imageAlt: e.target.value }))
                    }
                    placeholder="Architectural rendering of Fidelis Court"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Image Caption
                  </label>
                  <input
                    type="text"
                    value={formDraft.imageCaption || ""}
                    onChange={(e) =>
                      setFormDraft((prev) => ({ ...prev, imageCaption: e.target.value }))
                    }
                    placeholder="Phase 1 Structure Progress"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={3}
                  value={formDraft.summary || ""}
                  onChange={(e) =>
                    setFormDraft((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Short engaging excerpt shown on card preview..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0754C6]/20 focus:border-[#0754C6] focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Article Content
                </label>
                <BlogRichTextEditor
                  key={editingPost?.id ?? "new"}
                  value={formDraft.expandedContent || ""}
                  onChange={(expandedContent) =>
                    setFormDraft((prev) => ({
                      ...prev,
                      expandedContent,
                    }))
                  }
                  onUploadStateChange={setIsContentImageUploading}
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Format text, add quotes, lists, links, highlights, and uploaded images.
                </p>
              </div>

              {/* Published Switch */}
              <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-xs font-bold text-slate-900">Publish immediately</p>
                  <p className="text-[11px] text-slate-500">
                    If toggled off, this post will save as a draft.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formDraft.published ?? true}
                    onChange={(e) =>
                      setFormDraft((prev) => ({ ...prev, published: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0754C6]" />
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving || isUploadPending}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0754C6] hover:bg-[#0648AB] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSaving || isUploadPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  <span>
                    {isUploadPending
                      ? "Uploading image..."
                      : isSaving
                        ? "Saving..."
                        : editingPost
                          ? "Update Article"
                          : "Publish Article"}
                  </span>
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
        title="Delete Blog Article"
        description="Are you sure you want to delete this article? It will be permanently removed from the website."
        itemName={deleteTarget?.title}
        confirmText="Delete Article"
        isLoading={isDeleting}
      />
    </div>
  );
}
