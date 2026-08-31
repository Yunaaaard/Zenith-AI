export const parseAttachmentFile = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    const fileMeta = {
      id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: file.name,
      size: file.size,
      type: file.type || 'text/plain',
      fileObj: file,
      previewUrl: null,
      content: '',
    };

    // 1. Image Files -> Data URL for Vision Analysis
    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        fileMeta.previewUrl = e.target.result;
        resolve(fileMeta);
      };
      reader.readAsDataURL(file);
      return;
    }

    // 2. PDF Files -> Extract Text Streams
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      reader.onload = (e) => {
        const raw = e.target.result || '';
        // Extract printable text chunks from PDF stream
        const textMatches = raw.match(/\(([^()]{2,})\)/g) || [];
        const extractedText = textMatches
          .map((m) => m.slice(1, -1))
          .filter((t) => /[a-zA-Z0-9\s]{3,}/.test(t))
          .join(' ');

        fileMeta.content = extractedText.length > 50
          ? extractedText
          : `[PDF Document: ${file.name} (${formatFileSize(file.size)})]`;

        resolve(fileMeta);
      };
      reader.readAsText(file);
      return;
    }

    // 3. Text, Code, CSV, JSON, Markdown Files
    reader.onload = (e) => {
      fileMeta.content = e.target.result || '';
      resolve(fileMeta);
    };
    reader.readAsText(file);
  });
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
