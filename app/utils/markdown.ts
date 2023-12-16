export function extractText(annotations: any[], text: string) {
    annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
            const filePath = annotation.text;
            const fileId = annotation.file_path.file_id;
            const downloadPath = `/api/download/${fileId}/attachment`;
            // Create a regex pattern to match the markdown link format
            const pattern = new RegExp(`\\[([^\\]]+)\\]\\(${filePath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\)`, 'g');
            text = text.replace(pattern, (match, p1) => `[${p1}](${downloadPath})`);
        }
    });
    return text;
}

export function extractImage(fileId: string) {
    const downloadPath = `/api/download/${fileId}/inline`;
    console.log(downloadPath);

    const text = `![${fileId}](${downloadPath})`;

    console.log(text);
    return text;
}
