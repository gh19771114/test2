#!/usr/bin/env node

/**
 * 代码验证脚本
 * 检查所有可能导致页面加载问题的常见错误
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fileName = path.basename(filePath);

  // 1. 检查是否有 'use client' 指令（如果是客户端组件）
  if (filePath.includes('/app/') && content.includes('useState') && !content.includes("'use client'")) {
    warnings.push(`${fileName}: 使用了 useState 但缺少 'use client' 指令`);
  }

  // 2. 检查导入是否正确
  const importRegex = /^import\s+.*from\s+['"](.+?)['"]/gm;
  const imports = [...content.matchAll(importRegex)];
  imports.forEach(match => {
    const importPath = match[1];
    if (importPath.startsWith('@/')) {
      // 检查路径是否存在
      const resolvedPath = importPath.replace('@/', '');
      // 这里可以添加更详细的路径检查
    }
  });

  // 3. 检查 export default
  if (!content.includes('export default')) {
    errors.push(`${fileName}: 缺少 export default`);
  }

  // 4. 检查 JSX 结构
  let openTags = 0;
  let closeTags = 0;
  const tagStack = [];

  lines.forEach((line, i) => {
    // 匹配 JSX 标签（排除 TypeScript 泛型）
    const jsxOpenTags = line.match(/<[A-Z][a-zA-Z0-9]*|<\/[A-Z][a-zA-Z0-9]*|<\/[a-z][a-zA-Z0-9]*|<\/section|<\/div|<\/span|<\/button|<\/p|<\/h[1-6]|<\/main|<\/header|<\/footer/g) || [];
    const jsxCloseTags = line.match(/<\/[A-Z][a-zA-Z0-9]*|<\/[a-z][a-zA-Z0-9]*|<\/section|<\/div|<\/span|<\/button|<\/p|<\/h[1-6]|<\/main|<\/header|<\/footer/g) || [];
    
    jsxOpenTags.forEach(tag => {
      if (!tag.startsWith('</')) {
        openTags++;
        const tagName = tag.replace('<', '').split(' ')[0];
        tagStack.push({ tag: tagName, line: i + 1 });
      }
    });

    jsxCloseTags.forEach(() => {
      closeTags++;
      if (tagStack.length > 0) tagStack.pop();
    });
  });

  // 5. 检查未闭合的标签
  if (tagStack.length > 0) {
    tagStack.slice(-5).forEach(item => {
      warnings.push(`${fileName}: 行 ${item.line} 可能有未闭合的标签: ${item.tag}`);
    });
  }

  // 6. 检查是否有语法错误（基本的括号匹配）
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`${fileName}: 大括号不匹配 (${openBraces} 个 {, ${closeBraces} 个 })`);
  }

  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`${fileName}: 圆括号不匹配 (${openParens} 个 (, ${closeParens} 个 ))`);
  }
}

// 检查主要页面文件
const filesToCheck = [
  'app/maimai/page.tsx',
  'app/page.tsx',
  'components/PageLayout.tsx',
  'components/Header.tsx',
];

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    try {
      checkFile(filePath);
    } catch (error) {
      errors.push(`${file}: 检查时出错 - ${error.message}`);
    }
  }
});

// 输出结果
console.log('\n=== 代码验证结果 ===\n');

if (errors.length > 0) {
  console.log('❌ 错误:');
  errors.forEach(err => console.log(`  - ${err}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  警告:');
  warnings.forEach(warn => console.log(`  - ${warn}`));
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 未发现明显问题\n');
}

process.exit(errors.length > 0 ? 1 : 0);







