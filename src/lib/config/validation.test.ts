import {
  createEmptyMcpServer,
  createEmptyModelProvider,
  createSampleDraft,
} from "@/lib/config/defaults";
import { validateConfigDraft } from "@/lib/config/validation";

describe("config validation", () => {
  it("reports missing references, duplicate ids, and transport-specific requirements", () => {
    const draft = createSampleDraft();
    draft.general.activeProfile = "missing-profile";
    draft.general.projectDocMaxBytes = "-1";
    draft.general.mcpOauthCallbackPort = "0";
    draft.history.maxBytes = "-1";
    draft.agents.maxThreads = "0";
    draft.agents.maxDepth = "-1";
    draft.agents.jobMaxRuntimeSeconds = "1.5";
    draft.shellEnvironmentPolicy.set = [
      { key: "FOO", value: "bar" },
      { key: "FOO", value: "baz" },
    ];
    draft.modelProviders = [
      {
        ...createEmptyModelProvider(),
        id: "openai-compatible",
        name: "Provider A",
        baseUrl: "https://example.com/v1",
        wireApi: "responses",
        envKey: "API_KEY",
      },
      {
        ...createEmptyModelProvider(),
        id: "openai-compatible",
        name: "Provider B",
        baseUrl: "https://example.com/v2",
        wireApi: "responses",
        envKey: "API_KEY",
      },
    ];

    const httpServer = createEmptyMcpServer();
    httpServer.id = "docs";
    httpServer.transport = "http";
    httpServer.url = "";
    draft.mcpServers = [httpServer];

    const issues = validateConfigDraft(draft, "en");

    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "general.activeProfile" &&
          issue.message.includes("missing profile"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "modelProviders" &&
          issue.message.includes("Duplicate value: openai-compatible"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "mcpServers[0].url" &&
          issue.message.includes("Transport is HTTP"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "history.maxBytes" &&
          issue.message.includes("greater than 0"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "general.projectDocMaxBytes" &&
          issue.message.includes("greater than 0"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "general.mcpOauthCallbackPort" &&
          issue.message.includes("greater than 0"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "agents.maxThreads" &&
          issue.message.includes("greater than 0"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "agents.maxDepth" &&
          issue.message.includes("0 or greater"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "error" &&
          issue.path === "agents.jobMaxRuntimeSeconds" &&
          issue.message.includes("greater than 0"),
      ),
    ).toBe(true);
    expect(
      issues.some(
        (issue) =>
          issue.severity === "warning" &&
          issue.path === "shellEnvironmentPolicy.set" &&
          issue.message.includes("duplicate key"),
      ),
    ).toBe(true);
  });
});
