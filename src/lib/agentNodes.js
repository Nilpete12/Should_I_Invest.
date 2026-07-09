import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getFinancialSummary } from "./financeTool";

// Configuration for our deterministic, rapid analytical engine
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0, 
  maxRetries: 1,
});

/**
 * Node 1: The Ticker Resolver Agent
 * Translates messy text inputs into clean exchange shortcuts.
 */
export async function resolverNode(state) {
  console.log(`[Agent: Resolver] Resolving input: "${state.companyInput}"`);
  
  const prompt = `You are a stock market ticker expert. Look at this user input: "${state.companyInput}". 
  Identify the target company and respond ONLY with its valid stock market ticker symbol (e.g., AAPL, TSLA, MSFT, GOOGL). 
  Do not write full sentences, explanations, or use punctuation. Return just the raw uppercase ticker letters.`;
  
  const response = await model.invoke(prompt);
  const resolvedTicker = response.content.trim().toUpperCase();
  
  // Returning fields updates those specific items inside the global state
  return { ticker: resolvedTicker };
}

/**
 * Node 2: The Quantitative Financial Auditor Agent
 * Uses our external API utility to scrape balance sheets.
 */
export async function financialsNode(state) {
  console.log(`[Agent: Auditor] Fetching financials for ticker: ${state.ticker}`);
  
  const data = await getFinancialSummary(state.ticker);
  
  return { financialData: data };
}

/**
 * Node 3: The Macro Sentiment Analyst Agent
 * Analyzes market indicators, risks, and overarching opportunities.
 */
export async function sentimentNode(state) {
  console.log(`[Agent: Sentiment] Analyzing risks and trends for: ${state.ticker}`);
  
  const prompt = `Act as an expert Wall Street sentiment analyst. Given the ticker "${state.ticker}" and its core numbers: ${JSON.stringify(state.financialData)}, 
  outline the current macro trends, growth blockers, and market strengths surrounding this company in 3 clear bullet points.`;
  
  const response = await model.invoke(prompt);
  
  return { marketSentiment: response.content };
}

/**
 * Node 4: The Chief Investment Officer (CIO) Agent
 * Evaluates everything gathered and delivers the final high-stakes verdict.
 */
export async function cioNode(state) {
  console.log(`[Agent: CIO] Compiling research pack for final investment thesis...`);
  
  const prompt = `You are the Chief Investment Officer at an elite investment firm. Review this research folder:
  - Stock Ticker: ${state.ticker}
  - Balance Sheet Metrics: ${JSON.stringify(state.financialData)}
  - Macro Sentiment Notes: ${state.marketSentiment}
  
  Apply a rigorous risk-to-reward evaluation framework. You must issue a definitive decision: INVEST or PASS.
  
  Format your response exactly like this:
  DECISION: [INVEST or PASS]
  
  ### Executive Analysis Report
  [Provide your thorough markdown analysis including a Valuation Check, Strengths, Risks, and Final Recommendation Core Justification]`;
  
  const response = await model.invoke(prompt);
  const content = response.content;
  
  // Extracting the final decision type to cleanly store it state-side
  const decision = content.includes("DECISION: INVEST") ? "INVEST" : "PASS";
  
  return {
    decision: decision,
    reasoningMarkdown: content
  };
}