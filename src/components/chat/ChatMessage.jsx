import React from 'react';
import Logo from '../ui/Logo';
import CodeBlock from './CodeBlock';
import MessageActions from './MessageActions';
import { FileText, Image as ImageIcon } from 'lucide-react';

export default function ChatMessage({ message, onRegenerate, user }) {
  const isUser = message.role === 'user';

  // Inline formatting helper for bold, italic, inline code
  const parseInline = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i} className="italic text-slate-300">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-slate-900 text-indigo-300 font-mono text-[11px] rounded border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Robust Markdown block parser (handles code blocks, tables, headings, lists)
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const blocks = [];
    let inCode = false;
    let codeLang = '';
    let codeLines = [];
    let currentText = [];

    const flushText = () => {
      if (currentText.length > 0) {
        blocks.push({ type: 'text', content: currentText.join('\n') });
        currentText = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        if (inCode) {
          blocks.push({ type: 'code', language: codeLang, code: codeLines.join('\n') });
          inCode = false;
          codeLang = '';
          codeLines = [];
        } else {
          flushText();
          inCode = true;
          codeLang = line.trim().slice(3).trim() || 'text';
          codeLines = [];
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      // Detect start of a table block
      if (line.trim().startsWith('|')) {
        flushText();
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        i--; // back up one so the outer loop doesn't skip next line
        blocks.push({ type: 'table', lines: tableLines });
        continue;
      }

      currentText.push(line);
    }

    if (inCode) {
      blocks.push({ type: 'code', language: codeLang, code: codeLines.join('\n') });
    } else {
      flushText();
    }

    // Parse a table line into cells
    const parseTableRow = (line) =>
      line
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((cell) => cell.trim());

    const isSeparatorRow = (row) => row.every((cell) => /^:?-+:?$/.test(cell));

    return blocks.map((block, bIdx) => {
      if (block.type === 'code') {
        return <CodeBlock key={bIdx} language={block.language} code={block.code} />;
      }

      if (block.type === 'table') {
        const rows = block.lines.map(parseTableRow);
        const headerRow = rows[0];
        const sepIdx = rows.findIndex(isSeparatorRow);
        const bodyRows = sepIdx >= 0 ? rows.slice(sepIdx + 1) : rows.slice(1);

        return (
          <div key={bIdx} className="my-3 w-full overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs sm:text-sm border-collapse">
              {headerRow && (
                <thead>
                  <tr className="bg-indigo-500/10 border-b border-white/10">
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-3 py-2 text-left font-semibold text-indigo-300 whitespace-nowrap"
                      >
                        {parseInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`border-b border-white/5 transition-colors ${
                      rIdx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                    } hover:bg-indigo-500/5`}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-200 align-top">
                        {parseInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Process normal text block lines
      const textLines = block.content.split('\n');
      return (
        <div key={bIdx} className="space-y-1.5 my-2">
          {textLines.map((line, lIdx) => {
            const trimmed = line.trim();

            if (!trimmed) return <div key={lIdx} className="h-1.5" />;

            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={lIdx} className="text-lg font-bold text-white mt-4 mb-1.5">
                  {parseInline(trimmed.slice(3))}
                </h2>
              );
            }

            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={lIdx} className="text-base font-bold text-white mt-3 mb-1">
                  {parseInline(trimmed.slice(4))}
                </h3>
              );
            }

            if (trimmed.startsWith('#### ')) {
              return (
                <h4 key={lIdx} className="text-sm font-semibold text-indigo-300 mt-2 mb-1">
                  {parseInline(trimmed.slice(5))}
                </h4>
              );
            }

            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              return (
                <li key={lIdx} className="ml-4 list-disc text-slate-200 text-xs sm:text-sm leading-relaxed">
                  {parseInline(trimmed.replace(/^[*\-]\s+/, ''))}
                </li>
              );
            }

            if (/^\d+\.\s+/.test(trimmed)) {
              return (
                <li key={lIdx} className="ml-4 list-decimal text-slate-200 text-xs sm:text-sm leading-relaxed">
                  {parseInline(trimmed.replace(/^\d+\.\s+/, ''))}
                </li>
              );
            }

            return (
              <p key={lIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {parseInline(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };


  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 shadow">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'G')}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-500/30 flex items-center justify-center p-1 shadow-md shadow-indigo-500/10">
            <Logo size="xs" showText={false} />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-white">
            {isUser ? (user?.displayName || (user?.role === 'guest' ? 'Guest' : 'Developer')) : 'Zenith AI'}
          </span>
          <span className="text-[10px] text-slate-500">{message.timestamp}</span>
          {!isUser && message.model && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-medium">
              {message.model}
            </span>
          )}
        </div>

        {/* User Attached Files Badges */}
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-xs text-indigo-300">
                {att.type?.startsWith('image/') ? <ImageIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                <span className="truncate max-w-[160px] font-medium">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Formatted Content */}
        <div className="prose prose-invert max-w-none">
          {renderFormattedContent(message.content)}
        </div>

        {/* AI Action Toolbar */}
        {!isUser && (
          <MessageActions
            content={message.content}
            onRegenerate={() => onRegenerate && onRegenerate(message.id)}
          />
        )}
      </div>
    </div>
  );
}
