# Frontend 专项 Subagents 指引

这套包适合前端团队或偏 UI 的全栈项目，核心思路是把“实现、审查、可访问性、响应式、设计系统治理”拆给不同 agent。

来源：

- [Subagents](https://developers.openai.com/codex/subagents)
- [Models](https://developers.openai.com/api/docs/models)

## 包内容

- [`examples/frontend-subagents-pack/.codex/config.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/frontend-subagents-pack/.codex/config.toml)
- [`examples/frontend-subagents-pack/.codex/agents/ui-reviewer.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/frontend-subagents-pack/.codex/agents/ui-reviewer.toml)
- [`examples/frontend-subagents-pack/.codex/agents/interaction-builder.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/frontend-subagents-pack/.codex/agents/interaction-builder.toml)
- [`examples/frontend-subagents-pack/.codex/agents/a11y-auditor.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/frontend-subagents-pack/.codex/agents/a11y-auditor.toml)
- [`examples/frontend-subagents-pack/.codex/agents/responsive-triager.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/frontend-subagents-pack/.codex/agents/responsive-triager.toml)
- [`examples/frontend-subagents-pack/.codex/agents/design-system-guardian.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/frontend-subagents-pack/.codex/agents/design-system-guardian.toml)

## 推荐分工

### `ui_reviewer`

适合：

- PR review
- 发布前 UI 风险扫描
- 状态流与交互回归检查

### `interaction_builder`

适合：

- 组件实现
- 动效和交互修正
- 局部前端修复

### `a11y_auditor`

适合：

- 表单、对话框、导航、键盘交互检查
- 可访问性专项审查

### `responsive_triager`

适合：

- 移动端布局问题
- 文本溢出、错位、滚动跳动、点击区域不合理

### `design_system_guardian`

适合：

- token 漂移
- 组件 API 失控
- 视觉和交互模式不一致

## 默认 config.toml

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

## 建议用法

### 新功能开发

先让 `ui_reviewer` 或主 agent 明确交互边界，再让 `interaction_builder` 实现。

### 发布前检查

让 `ui_reviewer + a11y_auditor + responsive_triager` 并行检查。

### 设计系统治理

让 `design_system_guardian` 只做 read-only 审查，不要顺手实施大重构。

## 模型选择说明

这里的模型选择是我基于官方模型页做的工程推断：

- `gpt-5.4`：更适合高风险 review 和系统级判断
- `gpt-5.3-codex-spark`：官方 Subagents 示例中用于小范围探索和实现类 agent
- `gpt-5.4-mini`：适合窄范围、低成本审计任务；官方 Models 页面当前将它描述为适合 coding、computer use 和 subagents 的 strongest mini model

如果你的环境里某个模型不可用，删掉对应 `model` 字段即可回退为继承父会话模型。
