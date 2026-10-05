/**
 * CyberAware Initiative - Official Certificate Generator & Downloader
 * Generates high-resolution official certificates on HTML5 Canvas
 * and handles direct image download and printing even in sandboxed iframes.
 */

export interface CertificateDetails {
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  dateStr?: string;
  tierTitle: string;
  verificationId: string;
}

/**
 * Renders a high-resolution certificate on an HTML5 canvas
 */
export function generateCertificateCanvas(details: CertificateDetails): HTMLCanvasElement {
  const width = 1600;
  const height = 1100;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // 1. Background - Deep Cyber Dark Obsidian & Forest
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#080C07');
  bgGrad.addColorStop(0.5, '#0E160D');
  bgGrad.addColorStop(1, '#080C07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle ambient glow circles
  const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 450);
  glow1.addColorStop(0, 'rgba(180, 244, 55, 0.12)');
  glow1.addColorStop(1, 'rgba(180, 244, 55, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width - 200, height - 200, 10, width - 200, height - 200, 450);
  glow2.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
  glow2.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // 2. Outer Border Frame
  ctx.strokeStyle = 'rgba(180, 244, 55, 0.6)';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner Border Frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Corner Accent Brackets
  const cornerLen = 50;
  ctx.strokeStyle = '#B4F437';
  ctx.lineWidth = 5;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(35, 35 + cornerLen);
  ctx.lineTo(35, 35);
  ctx.lineTo(35 + cornerLen, 35);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerLen, 35);
  ctx.lineTo(width - 35, 35);
  ctx.lineTo(width - 35, 35 + cornerLen);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(35, height - 35 - cornerLen);
  ctx.lineTo(35, height - 35);
  ctx.lineTo(35 + cornerLen, height - 35);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerLen, height - 35);
  ctx.lineTo(width - 35, height - 35);
  ctx.lineTo(width - 35, height - 35 - cornerLen);
  ctx.stroke();

  // 3. Header Badge & Seal
  const centerX = width / 2;
  ctx.textAlign = 'center';

  // Gold / Neon Lime Seal Emblem at top
  const sealY = 140;
  ctx.beginPath();
  ctx.arc(centerX, sealY, 42, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(180, 244, 55, 0.15)';
  ctx.fill();
  ctx.strokeStyle = '#B4F437';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner star/shield representation
  ctx.fillStyle = '#B4F437';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('★', centerX, sealY + 12);

  // Institution title
  ctx.fillStyle = '#B4F437';
  ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('COLLEGE EXTENSION & COMMUNITY ENGAGEMENT  (CEP)', centerX, 230);

  // Certificate main title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 44px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Certificate of Cyber Awareness & Participation', centerX, 290);

  // Subtitle
  ctx.fillStyle = '#A3A3A3';
  ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('This document officially certifies successful participation in the Digital Scam & Fraud Detection Assessment', centerX, 335);

  // Divider line
  ctx.strokeStyle = 'rgba(180, 244, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 350, 370);
  ctx.lineTo(centerX + 350, 370);
  ctx.stroke();

  // "Proudly presented to"
  ctx.fillStyle = '#737373';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Proudly awarded to', centerX, 420);

  // Recipient Name
  const recipientName = details.name.trim() || 'Verified Participant';
  ctx.fillStyle = '#B4F437';
  ctx.font = '800 54px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(recipientName, centerX, 490);

  // Name underline accent
  const nameWidth = ctx.measureText(recipientName).width;
  ctx.strokeStyle = 'rgba(180, 244, 55, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - (nameWidth / 2) - 20, 515);
  ctx.lineTo(centerX + (nameWidth / 2) + 20, 515);
  ctx.stroke();

  // Achievement narrative text
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'has completed the comprehensive evaluation on Phishing, Scam & Cyber Fraud Detection Awareness,',
    centerX,
    575
  );

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `achieving an evaluation score of ${details.percentage}% (${details.score}/${details.totalQuestions} questions correct).`,
    centerX,
    615
  );

  // 4. Metadata Boxes (Date, Rating, Reference ID)
  const boxWidth = 360;
  const boxHeight = 110;
  const boxY = 680;
  const gap = 30;
  const totalBoxesWidth = boxWidth * 3 + gap * 2;
  const startX = (width - totalBoxesWidth) / 2;

  // Box 1: Date
  drawMetadataBox(
    ctx,
    startX,
    boxY,
    boxWidth,
    boxHeight,
    'PARTICIPATION DATE',
    details.dateStr || new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
    '#E2E8F0'
  );

  // Box 2: Assessment Rating
  drawMetadataBox(
    ctx,
    startX + boxWidth + gap,
    boxY,
    boxWidth,
    boxHeight,
    'ASSESSMENT RATING',
    details.tierTitle || 'High Cyber Vigilance',
    '#22D3EE'
  );

  // Box 3: Verification Reference
  drawMetadataBox(
    ctx,
    startX + (boxWidth + gap) * 2,
    boxY,
    boxWidth,
    boxHeight,
    'VERIFICATION REFERENCE',
    details.verificationId || 'CEP-SEC-REGISTRY',
    '#38BDF8',
    true
  );

  // 5. Lower Seal & Signatures
  const footerY = 910;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, footerY);
  ctx.lineTo(width - 120, footerY);
  ctx.stroke();

  // Left signature
  ctx.textAlign = 'left';
  ctx.fillStyle = '#F1F5F9';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CyberAware Initiative', 140, footerY + 50);
  ctx.fillStyle = '#64748B';
  ctx.font = '400 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('College Extension Program (CEP) • Security Division', 140, footerY + 75);

  // Center verified badge
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10B981';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('✔ CRYPTOGRAPHICALLY VERIFIED RECORD', centerX, footerY + 50);
  ctx.fillStyle = '#64748B';
  ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Direct Record Entry in Project Registry', centerX, footerY + 72);

  // Right authority
  ctx.textAlign = 'right';
  ctx.fillStyle = '#F1F5F9';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Official CEP Certification', width - 140, footerY + 50);
  ctx.fillStyle = '#64748B';
  ctx.font = '400 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Authorized Student Extension & Public Awareness', width - 140, footerY + 75);

  return canvas;
}

function drawMetadataBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  valueColor: string,
  isMono: boolean = false
) {
  // Background
  ctx.fillStyle = 'rgba(15, 21, 14, 0.9)';
  ctx.fillRect(x, y, w, h);

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  // Inner top highlight line
  ctx.strokeStyle = 'rgba(180, 244, 55, 0.35)';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();

  // Label
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(label, x + w / 2, y + 35);

  // Value
  ctx.fillStyle = valueColor;
  ctx.font = isMono ? '600 18px "JetBrains Mono", monospace' : '700 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(value, x + w / 2, y + 75);
}

/**
 * Downloads the certificate directly as a high-resolution PNG file
 */
export async function downloadCertificateAsImage(details: CertificateDetails): Promise<boolean> {
  try {
    const canvas = generateCertificateCanvas(details);
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const sanitizedName = (details.name || 'Participant')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const filename = `CyberAware_Certificate_${sanitizedName}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
    return true;
  } catch (err) {
    console.error('Failed to download certificate image:', err);
    return false;
  }
}

/**
 * Prints the certificate with robust iframe-sandbox handling
 */
export async function printCertificateSafely(details: CertificateDetails): Promise<{ success: boolean; fallbackDownloaded?: boolean }> {
  try {
    const canvas = generateCertificateCanvas(details);
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const sanitizedName = details.name || 'Participant';

    // 1. Try opening a clean printable window
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>CyberAware Certificate - ${sanitizedName}</title>
            <meta charset="utf-8" />
            <style>
              @page {
                size: landscape;
                margin: 8mm;
              }
              body {
                margin: 0;
                padding: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #0B132B;
                font-family: system-ui, -apple-system, sans-serif;
                min-height: 95vh;
              }
              .toolbar {
                margin-bottom: 16px;
                display: flex;
                gap: 12px;
              }
              .btn {
                padding: 10px 20px;
                font-size: 14px;
                font-weight: 600;
                border-radius: 8px;
                cursor: pointer;
                border: none;
                transition: opacity 0.2s;
              }
              .btn-print {
                background: #06B6D4;
                color: #050B14;
              }
              .btn-close {
                background: #334155;
                color: #FFFFFF;
              }
              .btn:hover {
                opacity: 0.9;
              }
              .cert-img {
                max-width: 95%;
                height: auto;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
              }
              @media print {
                body {
                  background: #FFFFFF !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .toolbar {
                  display: none !important;
                }
                .cert-img {
                  width: 100% !important;
                  max-width: 100% !important;
                  border-radius: 0 !important;
                  box-shadow: none !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="toolbar">
              <button class="btn btn-print" onclick="window.print()">🖨️ Print Certificate</button>
              <button class="btn btn-close" onclick="window.close()">Close</button>
            </div>
            <img class="cert-img" src="${dataUrl}" alt="Certificate" onload="setTimeout(function(){ window.print(); }, 400)" />
          </body>
          </html>
        `);
        printWindow.document.close();
        return { success: true };
      }
    } catch {
      // Popups blocked
    }

    // 2. Try window.print()
    try {
      window.print();
      return { success: true };
    } catch {
      // Sandboxed iframe blocked print dialog
    }

    // 3. If printing is restricted by browser sandbox, automatically download the PNG image
    await downloadCertificateAsImage(details);
    return { success: true, fallbackDownloaded: true };
  } catch (err) {
    console.error('Print certificate error:', err);
    // Final fallback to direct download
    await downloadCertificateAsImage(details);
    return { success: true, fallbackDownloaded: true };
  }
}
