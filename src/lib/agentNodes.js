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
  console.log(`[Agent: Resolver] Querying Yahoo Search Index for: "${state.companyInput}"`);
  
  let searchContext = "No direct database matches discovered.";
  
  try {
    // Actively fetch live matching options straight from Yahoo Finance's indexing engine
    const searchData = await yahooFinance.search(state.companyInput);
    if (searchData && searchData.quotes && searchData.quotes.length > 0) {
      searchContext = JSON.stringify(
        searchData.quotes.slice(0, 3).map(item => ({
          symbol: item.symbol,
          name: item.shortname || item.longname,
          exchange: item.exchange
        }))
      );
    }
  } catch (err) {
    console.warn("[Resolver Warning] Live index search dropped, falling back to LLM inference:", err.message);
  }

  const prompt = `You are an elite quantitative trade routing assistant. The user wants to audit: "${state.companyInput}".
  Here are the top live matching corporate entries pulled directly from the Yahoo Finance search database index:
  ${searchContext}
  
  Analyze the choices. Select the single absolute best matching ticker symbol string for the user's intent.
  Respond ONLY with the raw uppercase symbol (e.g. TATAMOTORS.NS, TCS.NS, AAPL, TSLA). Do not include markdown blocks, spaces, explanations, or trailing punctuation.`;
  
  const response = await model.invoke(prompt);
  const resolvedTicker = response.content.trim().toUpperCase();
  
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
  
  // Guardrail: Check if the financial auditor successfully pulled metrics
  const hasValidData = state.financialData && state.financialData.success !== false;
  
  if (!hasValidData) {
    return {
      decision: "PASS",
      reasoningMarkdown: `### Executive Analysis Report\n\n**DECISION: PASS**\n\n**Reasoning:** The investment agent network was unable to pull verified financial audit data for the requested entity ("${state.companyInput}"). As a strict risk-mitigation policy, we automatically pass on assets with unverifiable quantitative metrics.`
    };
  }

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
  const decision = content.includes("DECISION: INVEST") ? "INVEST" : "PASS";
  
  return {
    decision: decision,
    reasoningMarkdown: content
  };
}