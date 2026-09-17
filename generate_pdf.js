const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Read HTML file
  const htmlPath = 'M32-Central-Test-Suite-Report.html';
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Set content
  await page.setContent(html, { waitUntil: 'networkidle' });
  
  // Generate PDF with colors
  await page.pdf({
    path: 'M32-Central-Test-Suite-Report.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
  });
  
  console.log('✅ PDF generated: M32-Central-Test-Suite-Report.pdf');
  
  await browser.close();
})();
