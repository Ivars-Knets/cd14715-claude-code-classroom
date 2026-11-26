import * as dotenv from 'dotenv';

import { CodeReviewOrchestrator } from './orchestrator.js';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // TODO (Done): Validate command line arguments
    let pr_number :number;
    if ( typeof owner === "undefined" || typeof repo === "undefined" || typeof prStr === "undefined" ) {
      const definedValuesCount = 3;
      typeof owner === "undefined" ? definedValuesCount - 1 : null;
      typeof repo === "undefined" ? definedValuesCount - 1 : null;
      typeof prStr === "undefined" ? definedValuesCount - 1 : null;
      console.error("Input Validation Error: Missing inputs. Expected 3 input values, received "+ definedValuesCount + " input values.");
      return;
    }
    if ( typeof owner !== "string" ) {
      console.error('Input Validation Error: Value of "owner" is not a string.')
      return;
    }
    if ( typeof repo !== "string" ) {
      console.error('Input Validation Error: Value of "repo" is not a string.')
      return;
    }
    if ( isNaN(prStr) ) {
      console.error('Input Validation Error: Value of "prStr" is not a number.')
      return;
    } else {    
      pr_number = Number(prStr);
      if ( pr_number < 0 ){
        console.error('Input Validation Error: Value of "prStr" is a negative number, should be positive.')
        return;
      }
      if ( !Number.isInteger(pr_number) ){
        console.error('Input Validation Error: Value of "prStr" is a decimal number, should be integer.')
        return;
      }
    }


  // TODO: Validate authentication
    // If using Anthropic API:
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const claudeUrl = process.env.ANTHROPIC_BASE_URL;
      if (claudeKey !== undefined) {
        console.log("🔐 Using Anthropic API authentication.");
      } else {        
        console.error("Authentication Error: No authentication method configured. Check environment variables.");
        return;
      }


  // TODO: Validate ANTHROPIC_MODEL environment variable
  // This is REQUIRED for both authentication methods
  // - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0
  // - For Anthropic API: claude-sonnet-4-5-20250929
  // Exit with error if not set

  console.log('\nInputs : \n  owner -', owner, '\n  repo -', repo, '\n  prStr -', pr_number, '\n');
  try {
    // TODO: Create orchestrator instance
    const orchestrator = new CodeReviewOrchestrator();

    // TODO: Call .reviewPullRequest(owner, repo, prNumber);
    const result = await orchestrator.reviewPullRequest(owner, repo, pr_number);
    console.log(JSON.stringify(result, null, 2));

    // TODO: Generate formatted reports using ReportGenerator
    // Hint: Use ReportGenerator to create Markdown, HTML, and JSON reports
    // Save reports to 'reports/' directory with appropriate filenames
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
