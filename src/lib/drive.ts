/**
 * Utilitários para validação e formatação de links do Google Drive
 */

/** Valida se a URL é um link público do Google Drive */
export function validateDriveUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'drive.google.com' ||
      parsed.hostname === 'docs.google.com'
    );
  } catch {
    return false;
  }
}

/** Converte link de compartilhamento do Drive para URL de preview com visualizador embutido */
export function formatDrivePreviewUrl(url: string): string {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docIdMatch && docIdMatch[1]) {
      return `https://docs.google.com/document/d/${docIdMatch[1]}/preview`;
    }
  }
  return url.replace('/view', '/preview').replace('/edit', '/preview');
}
