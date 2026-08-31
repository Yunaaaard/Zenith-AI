import React from 'react';
import ConversationItem from './ConversationItem';

export default function ConversationList({
  groupedConversations,
  activeId,
  onSelect,
  onRename,
  onArchive,
  onDelete,
  collapsed,
}) {
  const groupKeys = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];
  let totalItems = 0;
  groupKeys.forEach((key) => {
    totalItems += groupedConversations[key]?.length || 0;
  });

  if (totalItems === 0) {
    if (collapsed) return null;
    return (
      <div className="px-3 py-3 text-xs text-slate-500 select-none">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-4">
      {groupKeys.map((group) => {
        const items = groupedConversations[group] || [];
        if (items.length === 0) return null;

        return (
          <div key={group} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {group}
              </h4>
            )}
            {items.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                onSelect={onSelect}
                onRename={onRename}
                onArchive={onArchive}
                onDelete={onDelete}
                collapsed={collapsed}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
