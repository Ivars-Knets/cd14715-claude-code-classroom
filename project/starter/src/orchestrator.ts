
import { query } from '@anthropic-ai/claude-agent-sdk';

import { buildOrchestratorPrompt } from './prompts'
import { ReviewReport, ReviewReportSchema, ReviewReportJSONSchema } from './types/report-types';
import { codeQualityAnalyzer, testCoverageAnalyzer, refactoringSuggester } from './agents';
import { SafeParseSuccess, SafeParseError } from 'zod';
import { ZodType } from 'zod/v4';

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
}

/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {


  constructor(options: OrchestratorOptions = {}) {
  }

  /**
   * Review a pull request using parallel subagent analysis
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param prNumber - Pull request number
   * @returns Complete review report
   */




  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<Object> {

  const startTime = Date.now();
  const elapsed = () => `Time elapsed so far: ${((Date.now() - startTime) / 1000).toFixed(1)} s`;

    for await (const message of query({
      prompt: buildOrchestratorPrompt(owner, repo, prNumber),
      options: {
        allowedTools: ["Task", "bash gh"],
        agents: {
          "code-quality-analyzer": codeQualityAnalyzer(),
          "test-coverage-analyzer": testCoverageAnalyzer(),
          "refactoring-suggester": refactoringSuggester(),
        },
        model: process.env.ANTHROPIC_MODEL,
        outputFormat: {
          type: "json_schema",
          schema: ReviewReportJSONSchema,
        },
        maxTurns: 5,
      },
    })) {
      console.log("----------- ", message.uuid);
      if (message.type === "assistant") {
        const content = message.message?.content;
        if ((message as any).parent_tool_use_id) {
          console.log(`  [${elapsed()}](running inside subagent)`, content);
        }

        if (Array.isArray(content)) {
          for (const block of content) {
            console.log('Using tool: ', block); 
            if (block.type === "tool_use" && block.name === "Task") {
              const input = block.input as { description?: string };
              console.log(`[${elapsed()}] Invoking subagent - ${input.description || "task"} `, block);
            }
          }
        }
      } else if (message.type === "result" && message.subtype === "success" && message.structured_output) {
        console.log(`[${elapsed()}] DONE`);
        return ReviewReportSchema.safeParse(message.structured_output);
      } else if (message.type === "result") {
        throw new Error(`Review Failed: ${message.subtype} `);
      }

    }
 
    throw new Error("Failed to review GitHub pull request.");

  }
}




