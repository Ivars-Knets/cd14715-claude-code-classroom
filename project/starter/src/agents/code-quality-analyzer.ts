import "dotenv/config";
import { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { CODE_QUALITY_ANALYZER_PROMPT } from "../prompts";

type ModelType = "sonnet" | "haiku" | "opus";
interface AgentFactoryOptions {
  modelOverride?: ModelType;
}

export function codeQualityAnalyzer(options: AgentFactoryOptions = {}): AgentDefinition {
  return {
    description: "Analysis specialist that analyzes code for security vulnerabilities, performance issues, and maintainability concerns.",
    prompt: CODE_QUALITY_ANALYZER_PROMPT,
    model: options.modelOverride || "inherit",
    tools: ['Read', 'Grep', 'Glob', 'Skill'],
    skills: ['javascript-best-practices'],
  };
};