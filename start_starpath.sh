#!/bin/bash

# StarPath 启动脚本
# 直接在项目目录下运行此脚本

# 设置 PATH 以包含本地安装的 Node.js
export PATH="$PWD/node/bin:$PATH"

echo "🌟 StarPath - ASD社会化辅助支持系统"
echo "==================================="
echo ""

# 检查并安装 Node.js（安装到项目目录）
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，正在自动安装..."

    # 下载 Node.js
    echo "📥 下载 Node.js..."
    curl -fsSL https://nodejs.org/dist/v20.10.0/node-v20.10.0-darwin-arm64.tar.xz -o /tmp/node.tar.xz

    # 解压到项目目录
    echo "📦 解压 Node.js..."
    mkdir -p ./node
    tar -xf /tmp/node.tar.xz -C ./node --strip-components=1

    # 添加到 PATH
    export PATH="$PWD/node/bin:$PATH"

    # 验证安装
    if command -v node &> /dev/null; then
        echo "✅ Node.js 安装成功"
    else
        echo "❌ Node.js 安装失败"
        echo "请手动安装 Node.js：https://nodejs.org/"
        read -p "按 Enter 退出..."
        exit 1
    fi
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 检查后端
if [ ! -d "backend" ]; then
    echo "❌ 错误：找不到后端目录"
    read -p "按 Enter 退出..."
    exit 1
fi

# 清理端口占用
echo ""
echo "🔧 检查端口占用..."
lsof -ti:8000 | xargs -r kill -9 2>/dev/null
lsof -ti:3000 | xargs -r kill -9 2>/dev/null
echo "✅ 端口已清理"

# 创建/激活虚拟环境
echo ""
echo "🔧 检查虚拟环境..."
if [ ! -d "backend/venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv backend/venv
    echo "✅ 虚拟环境创建成功"

    echo "📦 安装后端依赖..."
    source backend/venv/bin/activate
    pip install fastapi uvicorn sqlalchemy python-multipart 'pydantic[email]'
    echo "✅ 后端依赖安装完成"
else
    source backend/venv/bin/activate
    echo "✅ 虚拟环境已激活"
fi

# 启动后端
echo ""
echo "🚀 启动后端服务..."
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 3

# 检查后端状态
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ 后端服务启动成功 (http://localhost:8000)"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    deactivate
    read -p "按 Enter 退出..."
    exit 1
fi

# 启动前端（使用简单 HTTP 服务器）
echo ""
echo "🚀 启动前端服务..."
cd frontend/public

# 使用 Node.js 内置的 HTTP 服务器
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 对于 SPA，支持所有路由返回 index.html
                fs.readFile(path.join(DIST_DIR, 'index.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('✅ 前端服务启动成功 (http://localhost:' + PORT + ')');
});
" &
FRONTEND_PID=$!

echo ""
echo "🎉 StarPath 启动完成！"
echo "======================"
echo "🌐 前端地址: http://localhost:3000"
echo "🔌 API地址: http://localhost:8000"
echo "📖 API文档: http://localhost:8000/docs"
echo ""
echo "按 Enter 停止服务..."
read

echo ""
echo "🛑 停止服务..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
deactivate 2>/dev/null
echo "✅ 服务已停止"
