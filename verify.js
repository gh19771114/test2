// 简单的文件验证脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 验证项目文件...\n');

// 检查必需的文件
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'postcss.config.js',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'components/Header.tsx',
  'components/Hero.tsx',
  'components/Services.tsx',
  'components/Works.tsx',
  'components/Philosophy.tsx',
  'components/Contact.tsx',
  'components/Footer.tsx',
  'components/ScrollToTop.tsx'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件缺失`);
    allFilesExist = false;
  }
});

console.log('\n📦 检查package.json依赖...');

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'framer-motion',
    'lucide-react'
  ];
  
  const requiredDevDeps = [
    'typescript',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    'tailwindcss',
    'autoprefixer',
    'postcss'
  ];
  
  console.log('\n依赖项:');
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - 缺失`);
      allFilesExist = false;
    }
  });
  
  console.log('\n开发依赖:');
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - 缺失`);
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log('❌ package.json 解析错误:', error.message);
  allFilesExist = false;
}

console.log('\n🎨 检查Tailwind配置...');

try {
  const tailwindConfig = fs.readFileSync(path.join(__dirname, 'tailwind.config.js'), 'utf8');
  if (tailwindConfig.includes('navy') && tailwindConfig.includes('blue')) {
    console.log('✅ Tailwind配置包含自定义颜色');
  } else {
    console.log('⚠️  Tailwind配置可能不完整');
  }
} catch (error) {
  console.log('❌ tailwind.config.js 读取错误:', error.message);
  allFilesExist = false;
}

console.log('\n📱 检查组件文件...');

const componentFiles = [
  'Header.tsx',
  'Hero.tsx', 
  'Services.tsx',
  'Works.tsx',
  'Philosophy.tsx',
  'Contact.tsx',
  'Footer.tsx',
  'ScrollToTop.tsx'
];

componentFiles.forEach(component => {
  const filePath = path.join(__dirname, 'components', component);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('export default')) {
      console.log(`✅ ${component} - 有默认导出`);
    } else {
      console.log(`⚠️  ${component} - 可能缺少默认导出`);
    }
  }
});

console.log('\n📋 总结:');
if (allFilesExist) {
  console.log('🎉 所有必需文件都存在！');
  console.log('🚀 项目应该可以正常运行');
  console.log('\n运行命令:');
  console.log('1. npm install');
  console.log('2. npm run dev');
  console.log('3. 打开 http://localhost:3000');
} else {
  console.log('❌ 发现一些问题，请检查上述错误');
}

