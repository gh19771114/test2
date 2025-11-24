// pages/api/send-form.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

import nodemailer from "nodemailer";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "fontkit";

// 本地字体文件路径
const CHINESE_FONT_PATH = join(process.cwd(), 'public', 'fonts', 'NotoSansSC-Regular.ttf');

// 字体缓存（避免重复读取）
let cachedFontBytes: Buffer | null = null;

// 验证是否是有效的 TTF 字体文件
function isValidFontFile(bytes: Buffer): boolean {
  // TTF 文件通常以特定字节序列开头
  // 检查文件大小和基本结构
  if (bytes.length < 10000) return false; // 字体文件应该至少 10KB
  
  // TTF 文件可能以不同的标识符开头：
  // - 'OTTO' (OpenType with CFF)
  // - 'ttcf' (TrueType Collection)
  // - 0x00010000 (TrueType)
  // 简单检查：文件应该足够大且不是纯文本
  const firstBytes = bytes.slice(0, 100);
  const isText = firstBytes.every(byte => (byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13);
  
  // 检查是否是 HTML 响应（通常以 < 开头）
  const startsWithHTML = bytes[0] === 0x3C && bytes[1] === 0x21; // '<!'
  
  return !isText && !startsWithHTML && bytes.length > 50000; // 字体文件通常大于 50KB
}

// 从 CDN 下载字体并保存到本地
async function downloadFontFromCDN(): Promise<Buffer> {
  // 使用多个备用 URL，按优先级排序
  // 注意：这些 URL 可能不稳定，如果都失败，请手动下载字体文件
  const fontUrls = [
    // 方法1: 尝试使用 Google Fonts API 获取字体
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&display=swap',
    // 方法2: 使用 jsDelivr CDN
    'https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/Subset/TTF/SC/NotoSansSC-Regular.ttf',
  ];
  
  // 首先尝试从 Google Fonts CSS 中提取字体 URL
  try {
    console.log('尝试从 Google Fonts API 获取字体 URL...');
    const cssResponse = await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&display=swap');
    if (cssResponse.ok) {
      const cssText = await cssResponse.text();
      // 从 CSS 中提取字体 URL
      const fontUrlMatch = cssText.match(/url\(([^)]+)\)/);
      if (fontUrlMatch && fontUrlMatch[1]) {
        const extractedUrl = fontUrlMatch[1].replace(/['"]/g, '');
        fontUrls.unshift(extractedUrl); // 添加到列表开头
        console.log('从 CSS 中提取的字体 URL:', extractedUrl);
      }
    }
  } catch (e) {
    console.warn('无法从 Google Fonts API 获取字体 URL:', e);
  }
  
  for (let i = 0; i < fontUrls.length; i++) {
    let fontUrl = fontUrls[i];
    
    // 如果是 CSS URL，跳过（已经在前面处理了）
    if (fontUrl.includes('fonts.googleapis.com/css')) {
      continue;
    }
    
    try {
      console.log(`尝试从源 ${i + 1}/${fontUrls.length} 下载字体: ${fontUrl}`);
      const fontResponse = await fetch(fontUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/font-ttf, application/octet-stream, font/woff2, */*',
        },
      });
      
      if (fontResponse.ok) {
        const contentType = fontResponse.headers.get('content-type') || '';
        const fontBytes = await fontResponse.arrayBuffer();
        const fontBuffer = Buffer.from(fontBytes);
        
        // 如果是 CSS 文件，尝试提取字体 URL
        if (contentType.includes('text/css') || fontUrl.includes('.css')) {
          const cssText = fontBuffer.toString('utf-8');
          const urlMatches = cssText.match(/url\(['"]?([^'")]+)['"]?\)/g);
          if (urlMatches && urlMatches.length > 0) {
            // 提取第一个字体 URL（通常是 woff2 或 ttf）
            for (const match of urlMatches) {
              const extractedUrl = match.replace(/url\(['"]?([^'")]+)['"]?\)/, '$1');
              if (extractedUrl.includes('.ttf') || extractedUrl.includes('.woff')) {
                console.log('从 CSS 中提取字体 URL:', extractedUrl);
                // 递归尝试下载提取的 URL
                try {
                  const extractedResponse = await fetch(extractedUrl);
                  if (extractedResponse.ok) {
                    const extractedBytes = await extractedResponse.arrayBuffer();
                    const extractedBuffer = Buffer.from(extractedBytes);
                    if (isValidFontFile(extractedBuffer)) {
                      // 保存到本地
                      try {
                        const { mkdirSync } = require('fs');
                        const fontDir = join(process.cwd(), 'public', 'fonts');
                        mkdirSync(fontDir, { recursive: true });
                        writeFileSync(CHINESE_FONT_PATH, extractedBuffer);
                        console.log('字体已下载并保存到本地:', CHINESE_FONT_PATH);
                      } catch (writeError: any) {
                        console.warn('无法保存字体到本地，但可以使用内存中的字体:', writeError.message);
                      }
                      return extractedBuffer;
                    }
                  }
                } catch (e) {
                  console.warn('无法下载提取的字体 URL:', e);
                }
              }
            }
          }
          continue; // 跳过 CSS 文件
        }
        
        // 验证下载的文件是否是有效的字体
        if (isValidFontFile(fontBuffer)) {
          // 保存到本地
          try {
            // 确保目录存在
            const { mkdirSync } = require('fs');
            const fontDir = join(process.cwd(), 'public', 'fonts');
            try {
              mkdirSync(fontDir, { recursive: true });
            } catch (e) {
              // 目录可能已存在
            }
            
            writeFileSync(CHINESE_FONT_PATH, fontBuffer);
            console.log('字体已下载并保存到本地:', CHINESE_FONT_PATH);
          } catch (writeError: any) {
            console.warn('无法保存字体到本地，但可以使用内存中的字体:', writeError.message);
          }
          
          return fontBuffer;
        } else {
          console.warn(`从 ${fontUrl} 下载的文件似乎不是有效的字体文件 (大小: ${fontBuffer.length} bytes, Content-Type: ${contentType})`);
        }
      } else {
        console.warn(`从 ${fontUrl} 下载失败: HTTP ${fontResponse.status} ${fontResponse.statusText}`);
      }
    } catch (error: any) {
      console.warn(`无法从 ${fontUrl} 下载字体:`, error.message);
      continue;
    }
  }
  
  throw new Error('无法从任何 CDN 源下载字体文件。请手动下载 Noto Sans SC 字体文件到 public/fonts/NotoSansSC-Regular.ttf');
}

// 获取支持中文的字体
async function getChineseFont(pdfDoc: PDFDocument) {
  try {
    // 使用缓存（如果已加载）
    if (cachedFontBytes) {
      const font = await pdfDoc.embedFont(cachedFontBytes);
      return font;
    }
    
    // 尝试从本地文件读取
    if (existsSync(CHINESE_FONT_PATH)) {
      const fontBytes = readFileSync(CHINESE_FONT_PATH);
      
      // 验证是否是有效的字体文件
      if (isValidFontFile(fontBytes)) {
        cachedFontBytes = fontBytes;
        const font = await pdfDoc.embedFont(fontBytes);
        console.log('成功加载本地中文字体，大小:', fontBytes.length, 'bytes');
        return font;
      } else {
        console.warn('本地字体文件无效，尝试从 CDN 下载...');
      }
    } else {
      console.log('本地字体文件不存在，尝试从 CDN 下载...');
    }
    
    // 从 CDN 下载字体
    const fontBytes = await downloadFontFromCDN();
    cachedFontBytes = fontBytes;
    
    const font = await pdfDoc.embedFont(fontBytes);
    console.log('成功从 CDN 加载中文字体，大小:', fontBytes.length, 'bytes');
    return font;
    
  } catch (error: any) {
    console.error('无法加载中文字体:', error.message);
    throw new Error(`无法加载支持中文的字体，PDF 生成失败: ${error.message}`);
  }
}



// 文本换行辅助函数
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const lines: string[] = [];
  const words = text.split(/\s+/);
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine === '' ? word : currentLine + ' ' + word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.length > 0 ? lines : [text];
}

async function generatePdf(data: {

  name: string;

  email: string;

  message: string;

}) {

  const pdfDoc = await PDFDocument.create();
  
  // 注册 fontkit 以支持自定义字体
  // @ts-ignore - fontkit 类型定义与 pdf-lib 不完全匹配，但运行时兼容
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 尺寸

  // 使用支持中文的字体
  const font = await getChineseFont(pdfDoc);
  const boldFont = await getChineseFont(pdfDoc); // 使用同一字体作为粗体

  const { width, height } = page.getSize();

  const margin = 50;

  const fontSizeTitle = 20;

  const fontSizeLabel = 12;

  const fontSizeText = 11;

  const lineHeight = 18;

  let yPosition = height - margin - fontSizeTitle - 20;



  // 标题

  page.drawText("访客咨询信息", {

    x: margin,

    y: height - margin - fontSizeTitle,

    size: fontSizeTitle,

    font: boldFont,

    color: rgb(0, 0.53, 0.71), // 使用品牌色

  });



  yPosition -= 30;

  // 姓名

  page.drawText("姓名：", {

    x: margin,

    y: yPosition,

    size: fontSizeLabel,

    font: boldFont,

    color: rgb(0, 0, 0),

  });

  page.drawText(data.name, {

    x: margin + 60,

    y: yPosition,

    size: fontSizeText,

    font: font,

    color: rgb(0, 0, 0),

  });

  yPosition -= lineHeight * 1.5;



  // 邮箱

  page.drawText("邮箱：", {

    x: margin,

    y: yPosition,

    size: fontSizeLabel,

    font: boldFont,

    color: rgb(0, 0, 0),

  });

  page.drawText(data.email, {

    x: margin + 60,

    y: yPosition,

    size: fontSizeText,

    font: font,

    color: rgb(0, 0, 0),

  });

  yPosition -= lineHeight * 2;



  // 咨询内容标题

  page.drawText("咨询内容：", {

    x: margin,

    y: yPosition,

    size: fontSizeLabel,

    font: boldFont,

    color: rgb(0, 0, 0),

  });

  yPosition -= lineHeight;



  // 咨询内容（支持换行）

  const maxWidth = width - margin * 2;

  const messageLines = wrapText(data.message, maxWidth, font, fontSizeText);

  let currentPage = page;

  for (const line of messageLines) {

    if (yPosition < 50) {

      currentPage = pdfDoc.addPage([595.28, 841.89]);

      yPosition = height - margin;

    }

    currentPage.drawText(line, {

      x: margin,

      y: yPosition,

      size: fontSizeText,

      font: font,

      color: rgb(0, 0, 0),

    });

    yPosition -= lineHeight;

  }



  // 时间戳

  yPosition -= lineHeight * 2;

  if (yPosition < 50) {

    currentPage = pdfDoc.addPage([595.28, 841.89]);

    yPosition = height - margin;

  }

  const timestamp = new Date().toLocaleString('zh-CN', {

    timeZone: 'Asia/Tokyo',

    year: 'numeric',

    month: '2-digit',

    day: '2-digit',

    hour: '2-digit',

    minute: '2-digit',

  });

  currentPage.drawText(`提交时间：${timestamp}`, {

    x: margin,

    y: yPosition,

    size: 10,

    font: font,

    color: rgb(0.5, 0.5, 0.5),

  });



  const pdfBytes = await pdfDoc.save();

  return pdfBytes; // 返回 Uint8Array

}



// 生成解约申请PDF（基于模板）
async function generateTerminationPDF(formData: {
  name: string;
  address: string;
  building: string;
  room: string;
  phone: string;
  reason: string;
  moveOutDate: string;
  bankName: string;
  bankBranch: string;
  bankType: string;
  bankNumber: string;
  bankHolder: string;
}): Promise<Buffer> {
  try {
    // 下载PDF模板
    const templateUrl = 'https://storage.googleapis.com/bournmark_hp_assets/articles/kaiyaku.pdf';
    const templateResponse = await fetch(templateUrl);
    
    if (!templateResponse.ok) {
      throw new Error(`无法下载PDF模板: ${templateResponse.statusText}`);
    }
    
    const templateBytes = await templateResponse.arrayBuffer();
    
    // 加载PDF模板
    const pdfDoc = await PDFDocument.load(templateBytes);
    
    // 注册 fontkit 以支持自定义字体
    pdfDoc.registerFontkit(fontkit);
    
    // 获取表单字段
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    // 自动生成解约通知日期（当前日期）
    const terminationDate = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '/');
    
    // 格式化预计退房日期
    const moveOutDateFormatted = formData.moveOutDate
      ? new Date(formData.moveOutDate).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).replace(/\//g, '/')
      : '';
    
    // 字段映射
    const fieldMapping: { [key: string]: string } = {
      'name': formData.name,
      '姓名': formData.name,
      'phone': formData.phone,
      '电话': formData.phone,
      'tel': formData.phone,
      'address': formData.address,
      '地址': formData.address,
      'building': formData.building,
      '建筑': formData.building,
      'room': formData.room,
      '房间': formData.room,
      'roomNumber': formData.room,
      'terminationDate': terminationDate,
      '解约日期': terminationDate,
      '通知日期': terminationDate,
      'moveOutDate': moveOutDateFormatted,
      '退房日期': moveOutDateFormatted,
      'reason': formData.reason,
      '解约原因': formData.reason,
      'bankName': formData.bankName,
      '银行名称': formData.bankName,
      'bankBranch': formData.bankBranch,
      '分行': formData.bankBranch,
      'bankType': formData.bankType,
      '账户类别': formData.bankType,
      'bankNumber': formData.bankNumber,
      '账号': formData.bankNumber,
      'bankHolder': formData.bankHolder,
      '户名': formData.bankHolder,
      'accountName': formData.bankHolder,
    };
    
    // 尝试填充表单字段
    let filledFields = 0;
    for (const field of fields) {
      const fieldName = field.getName().toLowerCase();
      
      for (const [key, value] of Object.entries(fieldMapping)) {
        if (fieldName.includes(key.toLowerCase()) || fieldName === key.toLowerCase()) {
          try {
            const fieldType = (field as any).constructor.name;
            if (fieldType === 'PDFTextField' || 'setText' in field) {
              (field as any).setText(value || '');
              filledFields++;
            } else if (fieldType === 'PDFDropdown' || 'select' in field) {
              (field as any).select(value || '');
              filledFields++;
            }
            break;
          } catch (e) {
            console.warn(`无法填充字段 ${fieldName}:`, e);
          }
        }
      }
    }
    
    // 如果PDF没有表单字段，使用文本绘制方式
    if (filledFields === 0) {
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      // 使用支持中文的字体
      const font = await getChineseFont(pdfDoc);
      const boldFont = await getChineseFont(pdfDoc);
      
      let yPosition = height - 100;
      const lineHeight = 20;
      const margin = 50;
      
      firstPage.drawText(`姓名：${formData.name}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`电话：${formData.phone}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`地址：${formData.address}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`建筑名称：${formData.building}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`房间号：${formData.room}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight * 2;
      firstPage.drawText(`解约通知日期：${terminationDate}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`预计退房日期：${moveOutDateFormatted}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight * 2;
      firstPage.drawText(`解约原因：${formData.reason}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight * 2;
      firstPage.drawText(`银行名称：${formData.bankName}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`分行名称：${formData.bankBranch}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`账户类别：${formData.bankType}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`账号：${formData.bankNumber}`, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
      firstPage.drawText(`户名：${formData.bankHolder}`, { x: margin, y: yPosition, size: 12, font: font });
    }
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error: any) {
    console.error('填充PDF模板失败，使用备用方案:', error);
    
    // 备用方案：从头生成PDF
    const pdfDoc = await PDFDocument.create();
    
    // 注册 fontkit 以支持自定义字体
    pdfDoc.registerFontkit(fontkit);
    
    const page = pdfDoc.addPage([595, 842]);
    // 使用支持中文的字体
    const font = await getChineseFont(pdfDoc);
    const boldFont = await getChineseFont(pdfDoc);

    let yPosition = 800;
    const lineHeight = 20;
    const margin = 50;

    page.drawText('退租解约申请表', {
      x: margin,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.8, 0, 0),
    });

    yPosition -= 40;

    const terminationDate = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const basicInfo = [
      { label: '姓名', value: formData.name },
      { label: '联系电话', value: formData.phone },
      { label: '联系地址', value: formData.address },
      { label: '建筑名称', value: formData.building },
      { label: '房间号', value: formData.room },
    ];

    for (const info of basicInfo) {
      page.drawText(`${info.label}：`, { x: margin, y: yPosition, size: 12, font: boldFont });
      page.drawText(info.value, { x: margin + 100, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
    }

    yPosition -= lineHeight;

    const terminationInfo = [
      { label: '解约通知日期', value: terminationDate },
      { label: '预计退房日期', value: formData.moveOutDate },
    ];

    for (const info of terminationInfo) {
      page.drawText(`${info.label}：`, { x: margin, y: yPosition, size: 12, font: boldFont });
      page.drawText(info.value, { x: margin + 120, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
    }

    yPosition -= lineHeight;

    page.drawText('解约原因：', { x: margin, y: yPosition, size: 12, font: boldFont });
    yPosition -= lineHeight;

    const reasonLines = wrapText(formData.reason, 495, font, 12);
    let currentPage = page;
    for (const line of reasonLines) {
      if (yPosition < 50) {
        currentPage = pdfDoc.addPage([595, 842]);
        yPosition = 800;
      }
      currentPage.drawText(line, { x: margin, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
    }

    yPosition -= lineHeight * 2;

    if (yPosition < 50) {
      currentPage = pdfDoc.addPage([595, 842]);
      yPosition = 800;
    }
    currentPage.drawText('收款银行信息', {
      x: margin,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0.5),
    });
    yPosition -= lineHeight * 1.5;

    const bankInfo = [
      { label: '银行名称', value: formData.bankName },
      { label: '分行名称', value: formData.bankBranch },
      { label: '账户类别', value: formData.bankType },
      { label: '账号', value: formData.bankNumber },
      { label: '户名', value: formData.bankHolder },
    ];

    for (const info of bankInfo) {
      if (yPosition < 50) {
        currentPage = pdfDoc.addPage([595, 842]);
        yPosition = 800;
      }
      currentPage.drawText(`${info.label}：`, { x: margin, y: yPosition, size: 12, font: boldFont });
      currentPage.drawText(info.value, { x: margin + 100, y: yPosition, size: 12, font: font });
      yPosition -= lineHeight;
    }

    const timestamp = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    yPosition -= lineHeight * 2;
    if (yPosition < 50) {
      currentPage = pdfDoc.addPage([595, 842]);
      yPosition = 800;
    }
    currentPage.drawText(`提交时间：${timestamp}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

async function sendMailWithPdf(
  pdfBuffer: Buffer,
  subject: string,
  filename: string,
  textContent: string
) {
  // 验证环境变量
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.MAIL_TO) {
    throw new Error('邮件配置不完整，请检查环境变量：SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO');
  }

  // 正确解析 SMTP_SECURE（环境变量是字符串）
  const isSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === true || process.env.SMTP_PORT === '465';
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  
  console.log('SMTP 配置:', {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: isSecure,
    user: process.env.SMTP_USER,
    hasPassword: !!process.env.SMTP_PASS,
    mailTo: process.env.MAIL_TO,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: isSecure, // 465 端口需要 secure: true
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // 添加连接超时和调试选项
    connectionTimeout: 10000, // 10秒
    greetingTimeout: 10000,
    socketTimeout: 10000,
    debug: process.env.NODE_ENV === 'development', // 开发环境启用调试
    // 对于某些邮件服务器，可能需要这些选项
    tls: {
      rejectUnauthorized: false, // 如果证书有问题，可以设置为 false（仅用于测试）
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    subject: subject,
    text: textContent,
    attachments: [
      {
        filename: filename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    // 验证连接
    await transporter.verify();
    console.log('SMTP 服务器连接验证成功');
    
    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('邮件发送详细错误:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message,
    });
    throw error;
  }
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { formType, ...formData } = req.body || {};

  try {
    let pdfBuffer: Buffer;
    let subject: string;
    let filename: string;
    let textContent: string;

    if (formType === 'termination') {
      // 解约申请表单
      const { name, address, building, room, phone, reason, moveOutDate, bankName, bankBranch, bankType, bankNumber, bankHolder } = formData as any;

      // 验证必要字段
      if (!name || !address || !building || !room || !phone || !reason || !moveOutDate || !bankName || !bankBranch || !bankType || !bankNumber || !bankHolder) {
        return res.status(400).json({ error: "缺少必要字段" });
      }

      pdfBuffer = await generateTerminationPDF({
        name,
        address,
        building,
        room,
        phone,
        reason,
        moveOutDate,
        bankName,
        bankBranch,
        bankType,
        bankNumber,
        bankHolder,
      });

      subject = `退租解约申请 - ${name || '未填写姓名'}`;
      filename = `解约申请_${name || '未填写'}_${Date.now()}.pdf`;
      textContent = `
有新的退租解约申请：

姓名: ${name}
联系电话: ${phone}
联系地址: ${address}
建筑名称: ${building}
房间号: ${room}
预计退房日期: ${moveOutDate}
解约原因: ${reason}

收款银行信息:
银行名称: ${bankName}
分行名称: ${bankBranch}
账户类别: ${bankType}
账号: ${bankNumber}
户名: ${bankHolder}

详细内容请查看附件 PDF。
      `;
    } else {
      // 联系表单（默认）
      const { name, email, message, company } = formData as any;

      // 验证必要字段
      if (!name || !email || !message) {
        return res.status(400).json({ error: "缺少必要字段：name, email, message 为必填项" });
      }

      const pdfData = {
        name: name,
        email: email,
        message: company ? `公司：${company}\n\n${message}` : message
      };

      const pdfBytes = await generatePdf(pdfData);
      pdfBuffer = Buffer.from(pdfBytes); // 转换为 Buffer
      subject = `联系表单 - ${name || '未填写姓名'}`;
      filename = `联系表单_${name || '未填写'}_${Date.now()}.pdf`;
      textContent = `
有新的访客咨询信息：

姓名: ${name}
邮箱: ${email}
${company ? `公司: ${company}\n` : ''}
咨询内容:
${message}

详细内容请查看附件 PDF。
      `;
    }

    await sendMailWithPdf(pdfBuffer, subject, filename, textContent);

    return res.status(200).json({ 
      ok: true, 
      message: formType === 'termination' 
        ? "解约申请已提交，我们会尽快与您联系。" 
        : "表单已提交，我们会尽快与您联系。" 
    });

  } catch (error: any) {
    console.error("发送邮件失败:", error);
    
    // 提供更详细的错误信息
    let errorMessage = "发送邮件失败";
    if (error.code) {
      errorMessage += ` (错误代码: ${error.code})`;
    }
    if (error.response) {
      errorMessage += ` (服务器响应: ${error.response})`;
    }
    if (error.message) {
      errorMessage += ` - ${error.message}`;
    }
    
    return res.status(500).json({ 
      error: errorMessage, 
      details: error.message,
      code: error.code,
      response: error.response,
    });
  }
}

