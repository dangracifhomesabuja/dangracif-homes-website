"use client";

import * as React from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Underline as UnderlineIcon,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import toast from "react-hot-toast";

interface BlogRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadStateChange: (isUploading: boolean) => void;
}

const toolbarButtonClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40";

function isSafeLink(value: string) {
  return (
    /^https?:\/\//i.test(value) ||
    /^mailto:/i.test(value) ||
    /^tel:/i.test(value) ||
    (value.startsWith("/") && !value.startsWith("//"))
  );
}

export function BlogRichTextEditor({
  value,
  onChange,
  onUploadStateChange,
}: BlogRichTextEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      Highlight,
      Image.configure({ allowBase64: false }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "blog-rich-editor min-h-[220px] px-3 py-3 focus:outline-none",
        "aria-label": "Full article content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  const toggle = (action: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    action();
  };

  const addLink = () => {
    if (!editor) return;
    if (editor.state.selection.empty && !editor.isActive("link")) {
      toast.error("Select the text you want to link first.");
      return;
    }

    const url = window.prompt(
      "Enter a website URL or a path beginning with /",
      editor.getAttributes("link").href || "https://"
    );
    if (url === null) return;
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else if (isSafeLink(trimmedUrl)) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
    } else {
      toast.error("Use an http(s), mailto, tel, or internal site URL.");
    }
  };

  const uploadInlineImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large. Maximum size is 10MB.");
      return;
    }

    setIsUploading(true);
    onUploadStateChange(true);
    const toastId = toast.loading("Uploading article image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success || typeof result.url !== "string") {
        throw new Error(result.error || "Failed to upload image.");
      }

      const alt = window.prompt("Describe this image for accessibility.", file.name);
      editor
        ?.chain()
        .focus()
        .setImage({ src: result.url, alt: alt?.trim() || "" })
        .run();
      toast.success("Article image added.", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed.",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
      onUploadStateChange(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const button = (
    label: string,
    active: boolean,
    icon: React.ReactNode,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    disabled = !editor
  ) => (
    <button
      key={label}
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`${toolbarButtonClass} ${
        active
          ? "border-[#0754C6] bg-[#0754C6]/10 text-[#0754C6]"
          : "border-slate-200 bg-white"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        role="toolbar"
        aria-label="Article formatting"
        className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2"
      >
        {button("Bold", editor?.isActive("bold") ?? false, <Bold className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleBold().run()))}
        {button("Italic", editor?.isActive("italic") ?? false, <Italic className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleItalic().run()))}
        {button("Underline", editor?.isActive("underline") ?? false, <UnderlineIcon className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleUnderline().run()))}
        {button("Highlight", editor?.isActive("highlight") ?? false, <Highlighter className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleHighlight().run()))}
        {button("Heading 2", editor?.isActive("heading", { level: 2 }) ?? false, <Heading2 className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleHeading({ level: 2 }).run()))}
        {button("Heading 3", editor?.isActive("heading", { level: 3 }) ?? false, <Heading3 className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleHeading({ level: 3 }).run()))}
        {button("Bulleted list", editor?.isActive("bulletList") ?? false, <List className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleBulletList().run()))}
        {button("Numbered list", editor?.isActive("orderedList") ?? false, <ListOrdered className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleOrderedList().run()))}
        {button("Quote", editor?.isActive("blockquote") ?? false, <Quote className="h-4 w-4" />, toggle(() => editor?.chain().focus().toggleBlockquote().run()))}
        {button("Add link", editor?.isActive("link") ?? false, <LinkIcon className="h-4 w-4" />, toggle(addLink))}
        {button(
          isUploading ? "Uploading image" : "Insert image",
          false,
          isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />,
          toggle(() => fileInputRef.current?.click()),
          !editor || isUploading
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void uploadInlineImage(event.target.files?.[0])}
        />
      </div>
      <EditorContent editor={editor} />
      {isUploading && (
        <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">
          Uploading image. Please wait before saving.
        </p>
      )}
    </div>
  );
}
