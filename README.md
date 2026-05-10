# StarPath - ASD社会化辅助支持系统

> 让每个生命都能绽放光彩 🌟

## 项目简介

StarPath 是一个面向成年ASD（自闭症谱系障碍）患者的社会化辅助支持系统，旨在通过数据驱动的能力画像和个性化干预，帮助患者提升社交能力、职业技能和生活质量。

## 功能特性

- 🧠 **能力画像系统**：8大维度能力评估
- ☕ **咖啡馆岗位适应**：真实工作场景模拟
- 🎮 **场景模拟训练**：社交互动、任务执行模拟
- 📊 **数据分析面板**：可视化能力趋势
- 👥 **多角色支持**：患者、家长、康复老师、管理员

## 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                           │
│  HTML/CSS/JS + Material Design                         │
└───────────────────┬───────────────────────────────────────┘
                    │ HTTP/REST
┌───────────────────▼───────────────────────────────────────┐
│                      后端服务层                           │
│  FastAPI + Python + SQLite                             │
└───────────────────┬───────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────┐
│                      数据存储层                           │
│                      SQLite                             │
└───────────────────────────────────────────────────────────┘
```

## 快速开始

### 启动方式

**方式一：使用启动脚本（推荐）**
```bash
cd "/Users/emberios/Documents/trae_projects/starpath growth"
./start_starpath.sh
```

**方式二：双击应用**
- 找到 `启动 StarPath.app`
- 双击打开

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端界面 | http://localhost:3000 |
| API接口 | http://localhost:8000 |
| API文档 | http://localhost:8000/docs |

## 项目结构

```
starpath growth/
├── start_starpath.sh              # 启动脚本
├── 启动 StarPath.app              # macOS启动器
├── .gitignore                     # Git忽略配置
├── backend/                       # 后端服务
│   ├── app/
│   │   ├── main.py               # FastAPI入口
│   │   ├── models/               # SQLAlchemy模型
│   │   ├── routes/               # API路由
│   │   └── schemas/              # Pydantic模式
│   └── venv/                     # Python虚拟环境
├── frontend/                     # 前端应用
│   └── public/
│       ├── index.html            # 登录页面
│       └── dashboard.html        # 仪表板页面
├── docs/                         # 设计文档
│   ├── 项目路线图.md
│   ├── 项目报告.md
│   ├── 开发计划与里程碑.md
│   └── design/
│       ├── 01_能力维度模型.md
│       ├── 02_技术架构选型.md
│       └── 03_多模型生态平台架构.md
└── README.md                     # 项目说明
```

## 部署到GitHub

### 步骤1：创建GitHub仓库

1. 登录 [GitHub](https://github.com)
2. 创建一个新的仓库（推荐名称：`starpath`）
3. 复制仓库URL

### 步骤2：配置远程仓库

```bash
cd "/Users/emberios/Documents/trae_projects/starpath growth"
git remote set-url origin https://github.com/your-username/starpath.git
```

### 步骤3：推送代码

```bash
git push -u origin main
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 许可证

MIT License

---

**StarPath** - 让每个生命都能绽放光彩 🌟
