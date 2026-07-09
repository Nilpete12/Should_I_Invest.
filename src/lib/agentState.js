import { Annotation } from "@langchain/langgraph";

// Root establishes the base state template that our graph will enforce
export const InvestmentState = Annotation.Root({
  companyInput: Annotation(),       // Raw input entered by the user (e.g., "Tesla")
  ticker: Annotation(),             // Standardized stock ticker resolved by AI (e.g., "TSLA")
  financialData: Annotation(),      // Quantitative balance metrics from Yahoo Finance
  marketSentiment: Annotation(),    // Qualitative notes gathered about current news
  decision: Annotation(),           // The ultimate outcome: "INVEST" or "PASS"
  reasoningMarkdown: Annotation(),  // The executive summary backing up the choice
});