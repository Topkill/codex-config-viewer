# Backend Subagents 示例包

这套配置面向后端研发协作，重点覆盖：

- API correctness review
- schema / contract 保护
- 线上问题归因
- 迁移实现
- 性能瓶颈定位

建议先启用：

- `api_reviewer`
- `contract_guardian`
- `incident_triager`
- `migration_worker`

默认配置会同时设置全局限制，并注册每个 agent 文件：

```toml
[agents]
max_threads = 4
max_depth = 1
job_max_runtime_seconds = 1800

[agents.api_reviewer]
description = "Backend reviewer focused on correctness, failure handling, compatibility, and security across service boundaries."
config_file = "./agents/api-reviewer.toml"
nickname_candidates = ["Circuit", "Port", "Shield"]
```

官方参考：

- https://developers.openai.com/codex/subagents
- https://developers.openai.com/api/docs/models
