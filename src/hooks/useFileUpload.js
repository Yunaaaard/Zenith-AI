import { useState, useCallback } from 'react';
import { parseAttachmentFile } from '../lib/utils/fileParser';

export function useFileUpload() {
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);

    const parsed = [];
    for (let i = 0; i < fileList.length; i++) {
      try {
        const parsedFile = await parseAttachmentFile(fileList[i]);
        parsed.push(parsedFile);
      } catch (err) {
        console.error('File parsing error:', err);
      }
    }

    setAttachments((prev) => [...prev, ...parsed]);
    setUploading(false);
  }, []);

  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  return {
    attachments,
    isDragging,
    uploading,
    handleFiles,
    removeAttachment,
    clearAttachments,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
