


Section 2 - Multi Agent Orchestration:

    Multi-Agent Architecture (MAA) - 
        A system design that uses multiple, specialized AI agents collaborating to solve a complex problem.
    Orchestrator -
        This agent acts as the manager or coordinator. It understands the overall goal of the task but does not perform the specialized work itself. Its main responsibility is to break down the problem, delegate tasks to the appropriate subagents, and manage the flow of work.
    Subagents -
        These are the specialist workers. Each subagent is designed to perform a specific function exceptionally well. For example, one subagent might specialize in web research, another in data analysis, and a third in summarizing text.


    Orchestration Pattern - it defines how the Orchestrator coordinates the work of its subagents. Two foundational patterns are :
        - Sequential Pattern
            Subagents work one-after-another. 
            This pattern is predictable and easier to debug because the flow of work is linear. However, it can be slow, as the total time to completion is the sum of the time taken for each individual step.         
            Common research workflow example:
                Researcher Agent - gathers raw information on a topic.
                Analyzer Agent - takes this information and processes it, looking for key insights.
                Summarizer Agent - takes the analyzed findings and creates a concise report.

        - Parallel Pattern
            Used when tasks are independent of one another. The Orchestrator can initiate multiple subagents to work simultaneously, which can significantly reduce the overall completion time.
            The primary advantage of this pattern is speed, especially for large-scale tasks. The main challenge is the added complexity of managing multiple concurrent processes and then combining their individual results into a cohesive final output.

            Example:
                If research is needed on three separate, unrelated topics, the Orchestrator can deploy three researcher subagents in parallel. Each agent works on one topic at the same time.

        - Hybrid Pattern:
            Many complex systems combine both approaches. 
            Example:
                Researcher Subagents - several parallel agents gathering data from different sources;
                Analyzer Subagent - receive input from multiple subagents, process it all in one;
                Summarizer Subagent - summarize the analyzers output;

        - Producer-Reviewer Pattern:
            Uses specific subagents:
                - Producer agent - an agent responsible for creating the initial output or completing the primary task in a workflow;
                - Reviewer agent - specialized agent that evaluates the output of a producer agent and provides specific, actionable feedback for revision;








Section 3 - Orchestrate an MA system:

    Building a subagent:
        Example (lesson-10):
            function createSubAgent(modelOverride?: ModelType): AgentDefinition {
                return {
                    description: "Summarization specialist that creates clear, concise reports",
                    prompt: `You are a summarization specialist.
                            When given research and analysis:
                            1. Distill into key points
                            2. Create an executive summary
                            3. Highlight actionable recommendations
                            Be concise but comprehensive.`,
                    tools: [],
                    model: modelOverride || "haiku",
                };
            }

    Building orchestrator agent:
        an agentic loop that can call other agents to do things;
        Example (lesson-10):
            for await (const message of query({
                prompt: generateMessages(orchestratorPrompt),
                options: {
                    allowedTools: ["Task"], // Task tool - the mechanism for invoking a subagent;
                    agents: subagents, // Type = Record<string, AgentDefinition>
                    model: process.env.ANTHROPIC_MODEL,
                    maxTurns: 10,
                },
            })) {}






Section 4 - Hub-and-Spoke:
    Hub-and-Spoke system - four small contracts plus a coordinator;
        Each subagent gets:
            - a goal-oriented prompt - what the agent is trying to do and what shape its output must take.
            - set of tools a subagent is allowed to call
        The coordinator owns every cross-agent message.

    The subagents can be called in parallel using "asyncio.gather" eg. 
        results = await asyncio.gather(
            self._runner.run(WEATHER_AGENT, {"city": req.city}),
            self._runner.run(TRAFFIC_AGENT, {"route_id": req.route_id}),
            return_exceptions=True,
        )

    Pydantic - python library that validates structures of data going in and out of a subagent;
        _ALLOWED_EVIDENCE_FIELDS - list of fields an output can have; good to have it permissive rather then strict;
        _evidence_must_reference_known_fields - checks that cited evidence is used in on the allowed list;


    Bounded Iterative Refinement Loop with Coverage-Gap Detection
        Refinement - allowing a subagent to rerun with updated inputs;
        should have a "max_refinements" cap, 1 should be ok;





Section 5 - Deterministic Hooks

    tool use hook examples:
        PerToolUse - prevents action until other action succeeds;
        PostToolUse - normalize tool output;
        PreToolUse - analyzes calls before they are made, and redirects if needed; eg. value is over threshold;

    In practice, in an agentic loop, when making a tool call, first run some validations where needed, and if all seems good, then call the tool. Similar with tool output, when received check that is matches expectations or reformat/normalize the output values.

    Redirecting a tool call :
        - a handoff should contain field values from the tool input or a record; never reference a model conversation;
        - deterministic rules;







Project :

    task 1 - config
        File to complete: src/config/mcp.config.ts

        Before implementing, answer these questions:
            GitHub MCP Server:
                What package provides the GitHub MCP server? (Hint: Check the MCP servers repository)
                    "servers" package.
                What environment variable does it expect for authentication?
                    It expects a GITHUB_TOKEN environment variable.
                How do you map your GITHUB_TOKEN from .env to the expected variable name?
                    Using "dotenv" package. It would equal process.env.GITHUB_TOKEN

            ESLint MCP Server:
                What package provides the ESLint MCP server?

                Does it require authentication?
                    No. 


    task 2 - build subagents

        Agent Definitions: 
            What properties does an AgentDefinition have?
                https://code.claude.com/docs/en/agent-sdk/python#agentdefinition
            What does the model: 'inherit' setting mean?
                Means subagent will use the orchestration agents model.
            What's the purpose of the description field? (Hint: How does the orchestrator know when to use each agent?)
                Lets the orchestrator agent know what this subagent can be used for.
            What tools can agents use?
                https://code.claude.com/docs/en/sub-agents#available-tools