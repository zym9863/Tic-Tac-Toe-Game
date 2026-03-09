> English version: [README-EN.md](./README-EN.md)

# Tic Tac Toe Game

一个使用 React + Vite 构建的现代井字棋游戏。

## 功能特性

- **双人对战模式 (PvP)** - 本地双玩家轮流下棋
- **人机对战模式 (vs AI)** - 对战智能AI，使用 Minimax 算法 + Alpha-Beta 剪枝
- **计分系统** - 实时记录 X、O 和平局的胜场数
- **胜利高亮** - 醒目显示获胜的连线
- **游戏状态** - 显示当前玩家和游戏结果

## 技术栈

- React 19
- Vite 8
- CSS Modules

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── App.jsx          # 主应用组件
├── App.module.css   # 应用样式
├── gameLogic.js     # 游戏逻辑与AI算法
├── index.css        # 全局样式
└── main.jsx         # 入口文件
```

## 游戏规则

1. 玩家交替落子，X先手
2. 先在行、列或对角线上连成三子者获胜
3. 棋盘下满且无连子时为平局
