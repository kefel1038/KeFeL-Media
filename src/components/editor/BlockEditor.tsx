"use client";

import React, { useState } from "react";
import { GripVertical, Trash2, Heading, Type, Image, Quote, List, Sparkles } from "lucide-react";

type BlockType = "paragraph" | "heading" | "image" | "quote" | "bullets" | "highlight";

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

interface BlockEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function toHtml(blocks: Block[]): string {
  return blocks.map((b) => {
    switch (b.type) {
      case "heading": return `<h2>${b.content}</h2>`;
      case "quote": return `<blockquote>${b.content}</blockquote>`;
      case "bullets":
        const items = b.content.split("\n").filter(Boolean);
        return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
      case "highlight":
        const lines = b.content.split("\n").filter(Boolean);
        return `<div class="highlight-box"><h3>Key Highlights</h3><ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul></div>`;
      case "image": return `<figure><img src="${b.content}" alt="" class="rounded-xl shadow-md w-full" /></figure>`;
      default: return `<p>${b.content}</p>`;
    }
  }).join("\n");
}

function fromHtml(html: string): Block[] {
  if (!html.trim()) return [{ id: "0", type: "paragraph", content: "" }];
  const blocks: Block[] = [];
  const regex = /<(p|h2|blockquote|ul|figure|div)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  let idx = 0;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2].trim();
    if (tag === "p") blocks.push({ id: String(idx++), type: "paragraph", content: inner.replace(/<\/?[^>]+(>|$)/g, "") });
    else if (tag === "h2") blocks.push({ id: String(idx++), type: "heading", content: inner.replace(/<\/?[^>]+(>|$)/g, "") });
    else if (tag === "blockquote") blocks.push({ id: String(idx++), type: "quote", content: inner.replace(/<\/?[^>]+(>|$)/g, "") });
    else if (tag === "ul") {
      const items = inner.match(/<li>([\s\S]*?)<\/li>/gi)?.map((li) => li.replace(/<\/?li>/gi, "").trim()) ?? [];
      blocks.push({ id: String(idx++), type: "bullets", content: items.join("\n") });
    } else if (tag === "figure") blocks.push({ id: String(idx++), type: "image", content: inner.match(/src="([^"]+)"/)?.[1] ?? "" });
    else if (tag === "div" && match[0].includes("highlight-box")) {
      const items = inner.match(/<li>([\s\S]*?)<\/li>/gi)?.map((li) => li.replace(/<\/?li>/gi, "").trim()) ?? [];
      blocks.push({ id: String(idx++), type: "highlight", content: items.join("\n") });
    }
  }
  return blocks.length > 0 ? blocks : [{ id: "0", type: "paragraph", content: "" }];
}

const blockLabels: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  image: "Image",
  quote: "Quote",
  bullets: "Bullet List",
  highlight: "Highlight Box",
};

const blockIcons: Record<BlockType, React.ElementType> = {
  paragraph: Type,
  heading: Heading,
  image: Image,
  quote: Quote,
  bullets: List,
  highlight: Sparkles,
};

export default function BlockEditor({ value, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => fromHtml(value));

  const updateBlocks = (next: Block[]) => {
    setBlocks(next);
    onChange(toHtml(next));
  };

  const addBlock = (type: BlockType, afterIdx: number) => {
    const next = [...blocks];
    const newBlock: Block = { id: String(Date.now()), type, content: "" };
    next.splice(afterIdx + 1, 0, newBlock);
    updateBlocks(next);
  };

  const removeBlock = (idx: number) => {
    if (blocks.length <= 1) return;
    updateBlocks(blocks.filter((_, i) => i !== idx));
  };

  const updateContent = (idx: number, content: string) => {
    const next = blocks.map((b, i) => (i === idx ? { ...b, content } : b));
    setBlocks(next);
    onChange(toHtml(next));
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        const Icon = blockIcons[block.type];
        return (
          <div key={block.id} className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={13} className="text-gray-300 dark:text-zinc-600 cursor-grab" />
              <Icon size={13} className="text-brand" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{blockLabels[block.type]}</span>
              <div className="flex-1" />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {(["paragraph", "heading", "quote", "bullets", "highlight", "image"] as BlockType[]).map((t) => (
                  <button key={t} type="button" onClick={() => addBlock(t, idx)}
                    className="p-1 rounded text-gray-400 hover:text-brand hover:bg-brand/10 transition-colors"
                    title={`Add ${blockLabels[t]}`}>
                    {React.createElement(blockIcons[t], { size: 12 })}
                  </button>
                ))}
                <button type="button" onClick={() => removeBlock(idx)}
                  className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            {block.type === "image" ? (
              <input type="text" value={block.content} onChange={(e) => updateContent(idx, e.target.value)}
                placeholder="Image URL..."
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-white px-3 py-1.5 text-xs focus:outline-none focus:border-brand" />
            ) : (
              <textarea value={block.content} onChange={(e) => updateContent(idx, e.target.value)}
                rows={block.type === "bullets" || block.type === "highlight" ? 4 : 2}
                placeholder={block.type === "bullets" ? "One item per line..." : block.type === "highlight" ? "One highlight per line..." : `Enter ${blockLabels[block.type].toLowerCase()} content...`}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-white px-3 py-1.5 text-xs focus:outline-none focus:border-brand resize-y" />
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-1.5 pt-2">
        <span className="text-[10px] text-gray-400 font-medium">Add block:</span>
        {(["paragraph", "heading", "quote", "bullets", "highlight", "image"] as BlockType[]).map((t) => {
          const Icon = blockIcons[t];
          return (
            <button key={t} type="button" onClick={() => addBlock(t, blocks.length - 1)}
              className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-brand bg-gray-50 dark:bg-zinc-800 hover:bg-brand/10 px-2 py-1 rounded transition-colors">
              <Icon size={10} /> Add {blockLabels[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
