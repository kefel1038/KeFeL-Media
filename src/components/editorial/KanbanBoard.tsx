"use client";

import { useState } from "react";
import {
  GripVertical,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export interface KanbanCard {
  id: string;
  title: string;
  category: string;
  author: string;
  priority: "urgent" | "high" | "normal" | "low";
  dueDate?: string;
  tags: string[];
  assignee?: string;
  createdAt: string;
  aiGenerated: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveCard: (cardId: string, fromColumn: string, toColumn: string) => void;
  onEditCard: (card: KanbanCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function KanbanBoard({
  columns,
  onMoveCard,
  onEditCard,
  onDeleteCard,
}: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (draggedCard && dragOverColumn !== toColumnId) {
      onMoveCard(draggedCard, dragOverColumn!, toColumnId);
    }
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "normal":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg ${
            dragOverColumn === column.id ? "ring-2 ring-brand" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={`p-3 rounded-t-lg ${column.color}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{column.title}</h3>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded">
                {column.cards.length}
              </span>
            </div>
          </div>

          <div className="p-2 space-y-2 min-h-[200px]">
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => handleDragStart(card.id)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg p-3 border cursor-move hover:shadow-md transition-shadow ${
                  draggedCard === card.id ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-gray-400" />
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(card.priority)}`} />
                  </div>
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>

                <h4 className="font-medium text-sm mb-2">{card.title}</h4>

                <div className="flex flex-wrap gap-1 mb-2">
                  {card.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {card.author}
                  </div>
                  {card.dueDate && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(card.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {card.aiGenerated && (
                  <div className="mt-2 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    AI Generated
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
