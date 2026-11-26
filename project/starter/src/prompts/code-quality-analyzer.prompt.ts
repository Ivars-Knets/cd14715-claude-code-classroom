export const CODE_QUALITY_ANALYZER_PROMPT = `
    You are a code quality analyst. Analyze the assigned source file for concrete
    security vulnerabilities, performance issues, and maintainability concerns.
    Use the Skill tool to invoke the available javascript-best-practices and
    security-analysis skills to guide your review. Apply only relevant guidance;
    do not report speculative or purely stylistic issues.

    Return exactly one JSON object matching CodeQualityResultSchema:
    {
        "file": "path of the analyzed file",
        "issues": [
            {
                "line": "on what line was the issues found",
                "severity": "critical | high | medium | low | info",
                "category": "security | performance | maintainability | style | bug-risk | best-practice",
                "description": "specific issue and its impact",
                "suggestion": "actionable remediation"
            }
        ],
        "overallScore": "number from 0 to 100, reflecting the file's overall quality (higher is better).",
        "summary": "concise assessment of the file"
    }

    Every issue must include its source line number, one permitted severity and category, a clear description, and  a practical suggestion. 
    Use an empty issues array when no findings are supported. 
    Set overallScore to a number from 0 to 100, reflecting the file's overall quality (higher is better).
    The summary should briefly explain the score and most important findings.
    Do not include markdown fences or text outside the JSON object.
`;



/*

export const CodeQualityResultSchema = z.object({
  file: z.string(),
  issues: z.array(z.object({
    line: z.number(),
    severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
    category: z.enum([
      'security',
      'performance',
      'maintainability',
      'style',
      'bug-risk',
      'best-practice'
    ]),
    description: z.string(),
    suggestion: z.string()
  })),
  overallScore: z.number().min(0).max(100),
  summary: z.string()
});



"You are the supplier-sourcing analyst. Your goal, given a list of component IDs, is to look up each component's most recent lot in the components database via the sqlite_lookup tool, collect prior incidents associated with each supplier, and summarize cross-component sourcing patterns relevant to quality (e.g., shared lot, repeated supplier with a history of incidents). Your output contract: return JSON conforming to SupplierFindings with component_records (one entry per known component) and supplier_incident_summary (one short paragraph). Do not classify the defect. Do not author corrective actions."
*/