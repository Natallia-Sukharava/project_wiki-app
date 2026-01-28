import PDFDocument from 'pdfkit';
import path from 'path';

/**
 * Превращает HTML-контент статьи в простой текст для PDF.
 * Тк article.content хранится как HTML
 * (показываю через dangerouslySetInnerHTML).
 */
function htmlToPlainText(html) {
  if (!html) return '';

  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim();
}

// Генерирует PDF и стримит его прямо в response.

export function writeArticlePdfToResponse(res, article) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.font(path.resolve('assets/DejaVuSans.ttf'));

  const fileName = `article_${article.id}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  // Стрим: PDF в HTTP response
  doc.pipe(res);

  // Заголовок
  doc.fontSize(20).text(article.title || 'Untitled', { align: 'center' });
  doc.moveDown(0.5);

  // Метаданные
  const authorEmail = article.author?.email || 'Unknown';
  const workspaceName = article.workspace?.name || '—';
  const createdAt = article.createdAt
    ? new Date(article.createdAt).toLocaleString()
    : '—';

  doc
    .fontSize(10)
    .fillColor('gray')
    .text(`Author: ${authorEmail}`)
    .text(`Workspace: ${workspaceName}`)
    .text(`Created: ${createdAt}`);

  doc.moveDown();
  doc.fillColor('black');

  // Контент (HTML - plain text)
  const contentText = htmlToPlainText(article.content);
  doc.fontSize(12).text(contentText || '(empty)', {
    align: 'left',
    lineGap: 4,
  });

  doc.end();
}
