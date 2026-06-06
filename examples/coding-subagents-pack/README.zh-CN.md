# Coding Subagents 示例包

这是一个可直接复制到项目里的 `.codex` 示例包，面向常见的软件开发协作场景。

包含内容：

- `.codex/config.toml`
- `.codex/agents/pr-explorer.toml`
- `.codex/agents/reviewer.toml`
- `.codex/agents/docs-researcher.toml`
- `.codex/agents/test-triager.toml`
- `.codex/agents/fix-worker.toml`
- `.codex/agents/refactor-planner.toml`

建议先从这 4 个开始：

- `pr_explorer`
- `reviewer`
- `docs_researcher`
- `fix_worker`

默认配置会同时设置全局限制，并注册每个 agent 文件：

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

如果你的环境里某个模型不可用：

1. 删除对应 agent 文件中的 `model` 字段，让它继承父会话模型
2. 或统一替换成你当前环境已确认可用的模型

官方参考：

- https://developers.openai.com/codex/subagents
- https://developers.openai.com/api/docs/models
