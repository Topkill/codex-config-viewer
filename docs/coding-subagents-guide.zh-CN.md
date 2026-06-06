# Coding 专用 Subagents 指引

这套示例包基于 OpenAI 官方 Codex `Subagents` 文档整理，目标是给你一组“窄职责、强约束、适合工程协作”的专用型 agent，而不是一个什么都做的万能 agent。

官方依据：

- `custom agent` 文件必填字段是 `name`、`description`、`developer_instructions`
- 可选字段如 `model`、`model_reasoning_effort`、`sandbox_mode`、`mcp_servers`、`skills.config` 会在省略时继承父会话
- 全局子代理限制放在 `.codex/config.toml` 的 `[agents]` 下

来源：

- [Subagents](https://developers.openai.com/codex/subagents)
- [Models](https://developers.openai.com/api/docs/models)

## 文件位置

示例包位于：

- [`examples/coding-subagents-pack/.codex/config.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/config.toml)
- [`examples/coding-subagents-pack/.codex/agents/pr-explorer.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/agents/pr-explorer.toml)
- [`examples/coding-subagents-pack/.codex/agents/reviewer.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/agents/reviewer.toml)
- [`examples/coding-subagents-pack/.codex/agents/docs-researcher.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/agents/docs-researcher.toml)
- [`examples/coding-subagents-pack/.codex/agents/test-triager.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/agents/test-triager.toml)
- [`examples/coding-subagents-pack/.codex/agents/fix-worker.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/agents/fix-worker.toml)
- [`examples/coding-subagents-pack/.codex/agents/refactor-planner.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/coding-subagents-pack/.codex/agents/refactor-planner.toml)

## 推荐分工

### 1. `pr_explorer`

用途：

- 大仓库摸底
- 改动前调用链定位
- 先证据、后方案

建议：

- `sandbox_mode = "read-only"`
- 保持只读，不要顺手修

### 2. `reviewer`

用途：

- PR review
- correctness / regression / security / missing tests 检查

建议：

- 高推理
- 只输出 findings，不做风格警察

### 3. `docs_researcher`

用途：

- 校验框架、SDK、API 行为
- 避免“记忆型编程”

建议：

- 只查证，不改代码
- 如果你有专用 docs MCP，可以在该 agent 文件里补 `[mcp_servers.<id>]`

### 4. `test_triager`

用途：

- 测试失败归因
- 缩小最小失败范围
- 区分 flaky / 环境 / 逻辑 bug

建议：

- 允许 `workspace-write`
- 重点是复现和定位，不是直接大改

### 5. `fix_worker`

用途：

- 在根因明确后做最小修复

建议：

- 让它只接“边界明确的小修”
- 指令里始终强调 smallest defensible change

### 6. `refactor_planner`

用途：

- 大重构前拆分步骤
- 明确迁移边界、回滚点和测试策略

建议：

- 保持只读
- 只做计划，不直接落代码

## config.toml 配置建议

示例包默认值：

```toml
[agents]
max_threads = 4
max_depth = 1
job_max_runtime_seconds = 1800

[agents.reviewer]
description = "PR reviewer focused on correctness, security, behavioral regression, and missing tests."
config_file = "./agents/reviewer.toml"
nickname_candidates = ["Athena", "Ada", "Turing"]
```

解释：

- `max_threads = 4`：这是工程化建议值，不是官方默认值。官方文档写的是未设置时默认 `6`。我这里收敛到 `4`，是为了减少上下文污染和并行噪音。
- `max_depth = 1`：允许主 agent 派出一层子 agent，但不鼓励子 agent 再继续递归分发。
- `job_max_runtime_seconds = 1800`：和官方文档提到的 CSV fan-out 默认 worker 超时一致，便于统一预期。
- `[agents.<name>]`：按官方最新 sample 的 registry 形式，把 agent 名称、说明、配置文件路径和候选昵称集中声明在 `.codex/config.toml`。

## 如何使用

### 方式 A：整套复制

把示例包里的 `.codex` 目录整体复制到你的项目根目录。

### 方式 B：按需挑选

如果你只想先试最实用的 4 个，建议先复制这些：

- `pr-explorer.toml`
- `reviewer.toml`
- `docs-researcher.toml`
- `fix-worker.toml`

## 典型用法

### PR 审查

```
Review this branch against main. Have pr_explorer map the changed code paths, reviewer identify correctness and regression risks, and docs_researcher verify any framework or API assumptions.
```

### 测试失败

```
Use test_triager to reproduce and reduce the failing tests first. Once the root cause is clear, have fix_worker make the smallest defensible patch.
```

### 大重构

```
Ask refactor_planner to break this refactor into safe, reviewable stages before any implementation starts.
```

## 模型兼容建议

示例包里的模型名优先参考官方 `Subagents` 页面示例。

如果你的环境里某个模型不可用，有两个稳妥做法：

1. 删除该 agent 文件中的 `model` 字段，让它继承父会话模型
2. 统一替换成你当前环境中确定可用的模型

如果你更偏稳定兼容而不是成本分层，可以把所有高价值 agent 统一换成 `gpt-5.4`。

## 可选增强

你后续还可以给专用 agent 增加：

- `nickname_candidates`：让 UI 里显示更易读的名字
- `[mcp_servers.<id>]`：给 docs / browser / backend tooling 挂专用 MCP
- `[[skills.config]]`：给特定 agent 挂本地 skill，但这通常会引入机器路径依赖，不适合直接做成通用示例包
