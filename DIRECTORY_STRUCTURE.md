# 网站目录结构

```
2版/
├── app/                          # Next.js App Router 页面目录
│   ├── api/                      # API 路由
│   │   └── send-form/            # 表单提交 API
│   │
│   ├── cases/                    # 案例展示
│   │   ├── [slug]/               # 动态路由：案例详情页
│   │   │   └── page.tsx
│   │   └── page.tsx              # 案例列表页
│   │
│   ├── company/                  # 公司信息
│   │   ├── ceo/                  # CEO 介绍
│   │   │   └── page.tsx
│   │   ├── history/               # 企业沿革
│   │   │   └── page.tsx
│   │   ├── overview/             # 公司概览
│   │   │   └── page.tsx
│   │   ├── philosophy/           # 公司理念
│   │   │   └── page.tsx
│   │   └── sns/                  # 企业 SNS
│   │       └── page.tsx
│   │
│   ├── contact/                  # 联系表单
│   │   └── edit/                 # 修改页面（已删除）
│   │
│   ├── encyclopedia/             # 日本房产百科
│   │   └── [slug]/               # 动态路由：百科详情页
│   │       └── page.tsx
│   │
│   ├── maimai/                   # 买卖中介
│   │   └── page.tsx
│   │
│   ├── news/                     # 最新资讯
│   │   └── [slug]/               # 动态路由：新闻详情页
│   │       └── page.tsx
│   │
│   ├── privacy/                  # 隐私政策
│   │   └── page.tsx
│   │
│   ├── qichu/                    # 企业出海助力
│   │   └── page.tsx
│   │
│   ├── tenant/                   # 租客专用
│   │   ├── kaiyaku/              # 退租解约申请
│   │   │   ├── preview/          # 预览页面
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx          # 申请表单页面
│   │   └── page.tsx              # 租客专用首页
│   │
│   ├── touzi/                    # 资产投资运营
│   │   ├── cases/                # 投资案例
│   │   │   └── page.tsx
│   │   ├── properties/           # 投资项目
│   │   │   └── [slug]/           # 动态路由：项目详情页
│   │   │       └── page.tsx
│   │   ├── propertyData.ts       # 项目数据
│   │   └── page.tsx               # 投资运营首页
│   │
│   ├── wuye/                     # 物业管理
│   │   ├── baoxian/              # 相关保险
│   │   │   └── page.tsx
│   │   ├── ruzhu/                # 入住者服务
│   │   │   └── page.tsx
│   │   ├── shouzhi/              # 收支与税务
│   │   │   └── page.tsx
│   │   ├── xiushan/              # 修缮维护
│   │   │   └── page.tsx
│   │   ├── zengzhi/              # 资产增值
│   │   │   └── page.tsx
│   │   ├── zulin/                # 租赁管理
│   │   │   └── page.tsx
│   │   └── page.tsx              # 物业管理首页
│   │
│   ├── zulin/                    # 租赁（空目录）
│   │
│   ├── error.tsx                  # 错误页面
│   ├── globals.css                # 全局样式
│   ├── layout.tsx                 # 根布局
│   ├── not-found.tsx              # 404 页面
│   └── page.tsx                   # 首页
│
├── components/                    # React 组件
│   ├── Contact.tsx                # 联系表单组件
│   ├── FloatingActions.tsx        # 浮动操作按钮
│   ├── Footer.tsx                 # 页脚组件
│   ├── Header.tsx                 # 头部导航组件
│   ├── Hero.tsx                   # 首屏组件
│   ├── Insights.tsx               # 洞察/资讯组件
│   ├── LoadingSpinner.tsx         # 加载动画组件
│   ├── PageLayout.tsx             # 页面布局组件
│   ├── Philosophy.tsx             # 公司理念组件
│   ├── PropertyTools.tsx          # 房产工具组件
│   ├── Sakura.tsx                 # 樱花动画组件
│   ├── ScrollToTop.tsx            # 回到顶部组件
│   ├── Services.tsx               # 服务介绍组件
│   ├── ServiceTimeline.tsx        # 服务时间线组件
│   ├── VideoPlayer.tsx            # 视频播放器组件
│   └── Works.tsx                  # 案例展示组件
│
├── data/                          # 数据文件
│   ├── hero.ts                    # 首屏数据
│   ├── locales.ts                 # 多语言数据
│   └── services.ts                # 服务数据
│
├── imgs/                          # 图片资源（源文件）
│   ├── background.png             # 背景图片
│   ├── ceo1.png                   # CEO 图片 1
│   ├── ceo2.png                   # CEO 图片 2
│   ├── ceo3.png                   # CEO 图片 3
│   ├── logo-icon.png              # Logo 图标
│   ├── wechat_icon_130789.svg     # 微信图标
│   ├── xiaohongshu-seeklogo.svg   # 小红书图标
│   └── [其他图片文件]
│
├── lib/                           # 工具库
│   └── knowledge.ts               # 知识库数据（最新资讯、百科）
│
├── movie/                         # 视频资源（源文件）
│   └── top.mp4                    # 首页视频
│
├── pages/                         # Pages Router（兼容旧版）
│   └── api/                       # API 路由
│       └── send-form.ts           # 表单提交 API（邮件发送）
│
├── public/                        # 静态资源目录
│   ├── fonts/                     # 字体文件
│   │   └── NotoSansSC-Regular.ttf # 中文字体
│   ├── imgs/                      # 公共图片
│   │   ├── background.png
│   │   ├── wechat_icon_130789.svg
│   │   ├── xiaohongshu-seeklogo.svg
│   │   └── 图标 无背景.png
│   ├── masks/                     # 遮罩文件
│   │   └── ceo-fade-mask.svg      # CEO 图片渐变遮罩
│   ├── movie/                     # 公共视频
│   │   ├── top_compat.mp4         # 兼容版视频
│   │   ├── top.mp4                 # 首页视频
│   │   └── top.webm                # WebM 格式视频
│   └── favicon.svg                # 网站图标
│
├── scripts/                       # 脚本文件
│   ├── auto-fix-dev.sh            # 自动修复开发环境
│   ├── clean-and-restart.sh       # 清理并重启
│   ├── fix-build-error.sh         # 修复构建错误
│   ├── restart-dev.sh             # 重启开发服务器
│   └── verify-code.js             # 代码验证脚本
│
├── types/                         # TypeScript 类型定义
│   └── fontkit.d.ts               # FontKit 类型定义
│
├── .eslintrc.json                 # ESLint 配置
├── next.config.js                  # Next.js 配置
├── next-env.d.ts                  # Next.js 环境类型
├── package.json                   # 项目依赖配置
├── package-lock.json              # 依赖锁定文件
├── postcss.config.js              # PostCSS 配置
├── tailwind.config.js             # Tailwind CSS 配置
├── tsconfig.json                  # TypeScript 配置
├── start.sh                       # 启动脚本
├── verify.js                      # 验证脚本
│
├── [文档文件]
├── CURRENT_STATE.md               # 当前状态文档
├── demo.md                        # 演示文档
├── EMAIL_CONFIG.md                # 邮件配置说明
├── FONT_SETUP.md                  # 字体设置说明
├── PERMANENT_FIX.md               # 永久修复文档
├── PROJECT_SUMMARY.md             # 项目总结
├── README.md                      # 项目说明
├── SETUP.md                       # 设置文档
├── SMTP_AUTH_TROUBLESHOOTING.md   # SMTP 认证故障排除
├── TROUBLESHOOTING.md             # 故障排除文档
├── VERIFICATION_REPORT.md         # 验证报告
├── VIDEO_DIAGNOSIS.md             # 视频诊断文档
└── VIDEO_FIX.md                   # 视频修复文档
```

## 主要路由结构

### 页面路由
- `/` - 首页
- `/maimai` - 买卖中介
- `/wuye` - 物业管理
  - `/wuye/zulin` - 租赁管理
  - `/wuye/shouzhi` - 收支与税务
  - `/wuye/xiushan` - 修缮维护
  - `/wuye/ruzhu` - 入住者服务
  - `/wuye/baoxian` - 相关保险
  - `/wuye/zengzhi` - 资产增值
- `/touzi` - 资产投资运营
  - `/touzi/cases` - 投资案例
  - `/touzi/properties/[slug]` - 项目详情
- `/qichu` - 企业出海助力
- `/company` - 公司信息
  - `/company/overview` - 公司概览
  - `/company/ceo` - CEO 介绍
  - `/company/history` - 企业沿革
  - `/company/philosophy` - 公司理念
  - `/company/sns` - 企业 SNS
- `/cases` - 案例展示
  - `/cases/[slug]` - 案例详情
- `/news` - 最新资讯
  - `/news/[slug]` - 新闻详情
- `/encyclopedia` - 日本房产百科
  - `/encyclopedia/[slug]` - 百科详情
- `/tenant` - 租客专用
  - `/tenant/kaiyaku` - 退租解约申请
  - `/tenant/kaiyaku/preview` - 解约申请预览
- `/privacy` - 隐私政策

### API 路由
- `/api/send-form` - 表单提交（邮件发送）

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **邮件**: Nodemailer
- **PDF**: PDF-LIB


