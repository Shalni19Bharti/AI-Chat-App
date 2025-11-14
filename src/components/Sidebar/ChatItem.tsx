import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2, Download } from 'lucide-react';
import type { ChatSession } from '../../types';
import { formatTimestamp } from '../../utils/helpers';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (sessionId: string, newTitle: string) => void;
  onDownload: (session: ChatSession) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({
  session,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onDownload,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(session.title);
  const isSubmittingRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = () => {
    setIsMenuOpen(false);
    setIsRenaming(true);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isSubmittingRef.current = true;
    if (newTitle.trim() && newTitle.trim() !== session.title) {
      onRename(session.id, newTitle.trim());
    } else {
      setNewTitle(session.title);
    }
    setIsRenaming(false);
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 100);
  };

  const handleRenameCancel = (e?: React.FocusEvent<HTMLInputElement>) => {
    if (isSubmittingRef.current) {
      return;
    }
    if (e?.relatedTarget && (e.relatedTarget as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    setNewTitle(session.title);
    setIsRenaming(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDownload(session);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`
        group relative p-3 rounded-xl cursor-pointer transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-700/50
        ${isActive
          ? 'bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-4 border-blue-500 shadow-sm'
          : 'border-l-4 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <form onSubmit={handleRenameSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleRenameCancel}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleRenameCancel();
                  }
                }}
                className="w-full text-sm font-semibold bg-white dark:bg-gray-800 border border-blue-500 rounded px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          ) : (
            <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {session.title}
            </h3>
          )}
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(session.updatedAt)}
            </p>
          </div>
        </div>
        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="More options"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={handleRename}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span>Rename chat</span>
              </button>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionItem;