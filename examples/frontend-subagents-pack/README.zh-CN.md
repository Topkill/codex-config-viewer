# Frontend Subagents 示例包

这套配置面向前端研发协作，重点覆盖：

- 交互实现
- UI review
- 可访问性审查
- 响应式问题定位
- 设计系统一致性检查

建议先启用：

- `ui_reviewer`
- `interaction_builder`
- `a11y_auditor`
- `responsive_triager`

默认配置会同时设置全局限制，并注册每个 agent 文件：

```toml
[agents]
max_threads = 4
max_depth = 1
job_max_runtime_seconds = 1800

[agents.ui_reviewer]
description = "Frontend reviewer focused on visual regressions, interaction risks, accessibility, and missing UX coverage."
config_file = "./agents/ui-reviewer.toml"
nickname_candidates = ["Lens", "Pixel", "Prism"]
```

官方参考：

- https://developers.openai.com/codex/subagents
- https://developers.openai.com/api/docs/models
