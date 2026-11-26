import "dotenv/config";
import { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { TEST_COVERAGE_ANALYZER_PROMPT } from "../prompts";

type ModelType = "sonnet" | "haiku" | "opus";
interface AgentFactoryOptions {
  modelOverride?: ModelType;
}

export function testCoverageAnalyzer(options: AgentFactoryOptions = {}): AgentDefinition {
  return {
    description: "Test coverage analyst that evaluates test completeness and suggests specific test cases.",
    prompt: TEST_COVERAGE_ANALYZER_PROMPT,
    model: options.modelOverride || "inherit",
    tools: ['Read', 'Grep', 'Glob'],
  };
}