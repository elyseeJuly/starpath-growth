# StarPath Growth Git 同步指南

## 问题说明

当前沙箱环境无法使用 git 命令，原因是需要接受 Xcode 和 Apple SDKs 许可证。您需要在本地终端手动完成以下操作。

## 同步步骤

### 1. 打开终端

在 Mac 上打开 **终端** 应用（位于 `/Applications/Utilities/Terminal.app`）

### 2. 接受 Xcode 许可证

```bash
sudo xcodebuild -license accept
```

输入您的 Mac 用户密码后按回车。

### 3. 导航到项目目录

```bash
cd "/Users/emberios/Documents/trae_projects/starpath growth"
```

### 4. 初始化 Git 仓库

```bash
git init
```

### 5. 配置 Git 用户信息

```bash
git config user.email "your@email.com"
git config user.name "Your Name"
```

### 6. 添加远程仓库

```bash
git remote add origin https://github.com/elyseeJuly/starpath-growth.git
```

### 7. 添加所有文件并提交

```bash
git add .
git commit -m "Initial commit: ASDSocial多智能体框架 - 含多模型生态平台原型与咖啡馆职业辅助支持窗口"
```

### 8. 推送到 GitHub

```bash
git push -u origin main
```

如果提示输入 GitHub 用户名和密码，请使用您的 GitHub 账号信息。

### 9. 验证同步

```bash
git status
git log --oneline -5
```

## 后续同步流程

### 拉取远程更新

```bash
git pull origin main
```

### 提交本地更改

```bash
git add .
git commit -m "描述您的更改"
git push origin main
```

## GitHub 仓库地址

```
https://github.com/elyseeJuly/starpath-growth
```

## 项目文件结构

```
starpath-growth/
├── StarPath Starter.app/    # Mac 启动器应用
├── backend/                 # FastAPI 后端服务
├── frontend/                # React 前端应用
├── docs/                    # 项目文档
│   ├── design/              # 设计文档
│   ├── mvp/                 # MVP 文档
│   └── 重构文档/            # 重构文档
├── venv/                    # Python 虚拟环境
├── .gitignore               # Git 忽略配置
├── CODE_AUDIT.md            # 代码审计报告
├── README.md                # 项目说明
└── start_starpath.sh        # 启动脚本
```

## 注意事项

1. 如果遇到 GitHub 认证问题，建议使用 **GitHub Personal Access Token** 作为密码
2. 确保本地有 Node.js 和 Python 环境
3. 定期执行 `git pull` 获取团队最新代码

---

完成以上步骤后，您的项目就成功同步到 GitHub 了！
