const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const input = path.resolve(process.cwd(), 'Analise_Completa_Projeto_GAAK_2026-02-17.md');
const outputHtml = path.resolve(process.cwd(), 'Analise_Completa_Projeto_GAAK_2026-02-17.html');
const outputPdf = path.resolve(process.cwd(), 'Analise_Completa_Projeto_GAAK_2026-02-17.pdf');

const escapeHtml = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const markdownToHtml = (md) => {
  const lines = md.split(/\r?\n/);
  let html = '';
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.startsWith('# ')) {
      closeList();
      html += `<h1>${escapeHtml(line.slice(2))}</h1>`;
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      html += `<h3>${escapeHtml(line.slice(4))}</h3>`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
      continue;
    }

    closeList();
    html += `<p>${escapeHtml(line)}</p>`;
  }

  closeList();
  return html;
};

const buildHtmlDocument = (body) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Analise Completa Projeto GAAK</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111;
      margin: 0;
      padding: 32px 38px;
      line-height: 1.45;
      font-size: 12px;
      background: #fff;
    }
    h1 { font-size: 24px; margin: 0 0 12px; }
    h2 { font-size: 17px; margin: 22px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    h3 { font-size: 14px; margin: 14px 0 6px; }
    p { margin: 6px 0; }
    ul { margin: 4px 0 8px 18px; padding: 0; }
    li { margin: 3px 0; }
    @page { margin: 16mm 14mm; }
  </style>
</head>
<body>
${body}
</body>
</html>`;

(async () => {
  const md = fs.readFileSync(input, 'utf8');
  const htmlBody = markdownToHtml(md);
  const htmlDoc = buildHtmlDocument(htmlBody);
  fs.writeFileSync(outputHtml, htmlDoc, 'utf8');

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlDoc, { waitUntil: 'networkidle' });
    await page.pdf({
      path: outputPdf,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', right: '12mm', bottom: '14mm', left: '12mm' },
    });
  } finally {
    await browser.close();
  }

  process.stdout.write(`PDF gerado em: ${outputPdf}\n`);
})().catch((err) => {
  process.stderr.write(`${err.stack || err.message}\n`);
  process.exit(1);
});
