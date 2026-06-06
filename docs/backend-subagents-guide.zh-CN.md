# Backend 专项 Subagents 指引

这套包适合后端服务、平台工程、API 系统和数据密集型项目，核心思路是把“review、contract、防回归、事故归因、迁移、性能调查”拆成独立 agent。

来源：

- [Subagents](https://developers.openai.com/codex/subagents)
- [Models](https://developers.openai.com/api/docs/models)

## 包内容

- [`examples/backend-subagents-pack/.codex/config.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/backend-subagents-pack/.codex/config.toml)
- [`examples/backend-subagents-pack/.codex/agents/api-reviewer.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/backend-subagents-pack/.codex/agents/api-reviewer.toml)
- [`examples/backend-subagents-pack/.codex/agents/contract-guardian.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/backend-subagents-pack/.codex/agents/contract-guardian.toml)
- [`examples/backend-subagents-pack/.codex/agents/incident-triager.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/backend-subagents-pack/.codex/agents/incident-triager.toml)
- [`examples/backend-subagents-pack/.codex/agents/migration-worker.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/backend-subagents-pack/.codex/agents/migration-worker.toml)
- [`examples/backend-subagents-pack/.codex/agents/perf-investigator.toml`](/Users/oushiyong/code/github.com/depressi0n/codex-config-viewer/examples/backend-subagents-pack/.codex/agents/perf-investigator.toml)

## 推荐分工

### `api_reviewer`

适合：

- 评审 API 改动
- 权限边界、失败处理、兼容性检查

### `contract_guardian`

适合：

- request/response schema 变更
- 事件协议、数据库 schema、版本迁移风险

### `incident_triager`

适合：

- 线上故障复现
- 失败边界定位
- 最小复现路径收敛

### `migration_worker`

适合：

- SDK 升级
- schema 迁移
- 存储层或接口层的窄范围迁移

### `perf_investigator`

适合：

- 延迟升高
- 热点查询
- fan-out 过多
- retry storm
- 吞吐与资源浪费问题

## 默认 config.toml

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

## 建议用法

### API 变更前

先让 `contract_guardian` 评估破坏面，再让 `migration_worker` 或主 agent 落代码。

### 线上问题处理

先用 `incident_triager` 收敛问题，再决定是否交给 `migration_worker` 或主 agent 修复。

### 发布前

让 `api_reviewer + contract_guardian + perf_investigator` 并行做最后一轮风险扫描。

## 模型选择说明

这里的模型选择是我基于官方模型页做的工程推断：

- `gpt-5.4`：更适合复杂 review 和高风险兼容性判断
- `gpt-5.3-codex`：更适合 agentic coding、迁移实现和事故排查

如果你的环境里某个模型不可用，删掉对应 `model` 字段即可回退为继承父会话模型。
