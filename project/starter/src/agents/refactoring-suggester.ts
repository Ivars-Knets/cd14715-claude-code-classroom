import "dotenv/config";
import { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { REFACTORING_SUGGESTER_PROMPT } from "../prompts";

type ModelType = "sonnet" | "haiku" | "opus";
interface AgentFactoryOptions {
  modelOverride?: ModelType;
}

export function refactoringSuggester(options: AgentFactoryOptions = {}): AgentDefinition {
  return {
    description: "Refactoring specialist that can suggest effective code refactoring.",
    prompt: REFACTORING_SUGGESTER_PROMPT,
    model: options.modelOverride || "inherit",
    tools: ['Skill'],
    skills: ['javascript-best-practices'],
  };
}