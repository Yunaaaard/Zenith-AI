export const parseAttachmentFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const fileMeta = {
      id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: file.name,
      size: file.size,
      type: file.type,
      fileObj: file,
      previewUrl: null,
      content: '',
    };

    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        fileMeta.previewUrl = e.target.result;
        resolve(fileMeta);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        fileMeta.content = e.target.result;
        resolve(fileMeta);
      };
      reader.readAsText(file);
    }
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
