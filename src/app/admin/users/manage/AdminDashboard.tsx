"use client";

import React, { useState, useTransition } from "react";
import { deleteTheory, deleteComment } from "../../actions";
import { Trash2, FileText, MessageSquare, AlertCircle, Search, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

type Theory = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  upvotes: number;
  _count?: {
    comments: number;
  };
};

type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  upvotes: number;
  parentId: string | null;
  theory: {
    title: string;
  };
};

type Props = {
  initialTheories: Theory[];
  initialComments: Comment[];
};

export default function AdminDashboard({ initialTheories, initialComments }: Props) {
  const [activeTab, setActiveTab] = useState<"theories" | "comments">("theories");
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "asc" | "desc" } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleDeleteTheory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this theory? This action cannot be undone.")) return;

    startTransition(async () => {
      const res = await deleteTheory(id);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  const handleDeleteComment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) return;

    startTransition(async () => {
      const res = await deleteComment(id);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  const filteredTheories = initialTheories.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = sortConfig.key === 'comments' ? (a._count?.comments || 0) : (a as any)[sortConfig.key];
    const bVal = sortConfig.key === 'comments' ? (b._count?.comments || 0) : (b as any)[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredComments = initialComments.filter(c =>
    c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = (a as any)[sortConfig.key];
    const bVal = (b as any)[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage user theories and comments.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 border-b border-zinc-800">
        <div className="flex gap-4 flex-1">
          <button
            onClick={() => { setActiveTab("theories"); setSortConfig(null); setSearchQuery(""); }}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === "theories" ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Theories
              <span className="ml-2 bg-zinc-800 text-zinc-300 py-0.5 px-2 rounded-full text-xs">
                {initialTheories.length}
              </span>
            </div>
            {activeTab === "theories" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab("comments"); setSortConfig(null); setSearchQuery(""); }}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === "comments" ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              Comments & Replies
              <span className="ml-2 bg-zinc-800 text-zinc-300 py-0.5 px-2 rounded-full text-xs">
                {initialComments.length}
              </span>
            </div>
            {activeTab === "comments" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100" />
            )}
          </button>
        </div>
        <div className="relative pb-4">
          <Search size={16} className="absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors w-full md:w-64"
          />
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm rounded-sm overflow-hidden">
        <div className="border-b border-zinc-800 p-6 flex items-center justify-between bg-zinc-900/20">
          <h2 className="font-mono text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={16} /> Data Log
          </h2>
          <span className="text-xs font-mono text-zinc-600">
            Showing {activeTab === "theories" ? filteredTheories.length : filteredComments.length} {activeTab}
          </span>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "theories" ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-zinc-900/10">
                  <th className="p-4 font-normal w-8"></th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('title')}>Title {getSortIcon('title')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('author')}>Author {getSortIcon('author')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('createdAt')}>Date {getSortIcon('createdAt')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('comments')}>Comments {getSortIcon('comments')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('upvotes')}>Upvotes {getSortIcon('upvotes')}</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm text-zinc-300">
                {filteredTheories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">No theories found.</td>
                  </tr>
                ) : (
                  filteredTheories.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => toggleExpand(item.id)}
                        className={`border-b border-zinc-800/50 transition-colors cursor-pointer ${isPending ? 'opacity-50' : 'hover:bg-zinc-900/50'} ${expandedRows.has(item.id) ? 'bg-zinc-900/30 border-b-transparent' : ''}`}
                      >
                        <td className="p-4 text-zinc-600">
                          <ChevronRight size={16} className={`transition-transform ${expandedRows.has(item.id) ? 'rotate-90' : ''}`} />
                        </td>
                        <td className="p-4 text-white/90 truncate max-w-[200px]" title={item.title}>
                          {item.title}
                        </td>
                        <td className="p-4 text-zinc-400">{item.author}</td>
                        <td className="p-4 tabular-nums text-zinc-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                        </td>
                        <td className="p-4 tabular-nums">{item._count?.comments || 0}</td>
                        <td className="p-4 tabular-nums">{item.upvotes}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => handleDeleteTheory(item.id, e)}
                            disabled={isPending}
                            className="text-red-400/80 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-sm"
                            title="Delete Theory"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(item.id) && (
                        <tr className="border-b border-zinc-800/50 bg-zinc-900/10">
                          <td colSpan={7} className="p-6 text-zinc-400 text-sm whitespace-pre-wrap font-sans">
                            <div className="pl-6 border-l-2 border-zinc-800/80">
                              {item.content}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-zinc-900/10">
                  <th className="p-4 font-normal w-8"></th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('text')}>Text {getSortIcon('text')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('author')}>Author {getSortIcon('author')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('theory')}>Theory {getSortIcon('theory')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('parentId')}>Type {getSortIcon('parentId')}</th>
                  <th className="p-4 font-normal cursor-pointer hover:text-zinc-300 transition-colors" onClick={() => handleSort('createdAt')}>Date {getSortIcon('createdAt')}</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm text-zinc-300">
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">No comments found.</td>
                  </tr>
                ) : (
                  filteredComments.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => toggleExpand(item.id)}
                        className={`border-b border-zinc-800/50 transition-colors cursor-pointer ${isPending ? 'opacity-50' : 'hover:bg-zinc-900/50'} ${expandedRows.has(item.id) ? 'bg-zinc-900/30 border-b-transparent' : ''}`}
                      >
                        <td className="p-4 text-zinc-600">
                          <ChevronRight size={16} className={`transition-transform ${expandedRows.has(item.id) ? 'rotate-90' : ''}`} />
                        </td>
                        <td className="p-4 text-white/90 truncate max-w-[250px]" title={item.text}>
                          {item.text}
                        </td>
                        <td className="p-4 text-zinc-400">{item.author}</td>
                        <td className="p-4 text-zinc-500 truncate max-w-[150px]" title={item.theory?.title}>
                          {item.theory?.title || "Unknown"}
                        </td>
                        <td className="p-4 text-zinc-400">
                          {item.parentId ? (
                            <span className="text-[10px] uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded-sm text-zinc-300">Reply</span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider bg-zinc-800/50 px-2 py-1 rounded-sm text-zinc-400">Comment</span>
                          )}
                        </td>
                        <td className="p-4 tabular-nums text-zinc-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => handleDeleteComment(item.id, e)}
                            disabled={isPending}
                            className="text-red-400/80 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-sm"
                            title="Delete Comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(item.id) && (
                        <tr className="border-b border-zinc-800/50 bg-zinc-900/10">
                          <td colSpan={7} className="p-6 text-zinc-400 text-sm whitespace-pre-wrap font-sans">
                            <div className="pl-6 border-l-2 border-zinc-800/80">
                              {item.text}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
