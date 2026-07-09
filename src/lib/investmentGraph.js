import { StateGraph, START, END } from "@langchain/langgraph";
import { InvestmentState } from "./agentState";
import { resolverNode, financialsNode, sentimentNode, cioNode } from "./agentNodes";

// 1. Initialize our architecture blueprint map
const workflow = new StateGraph(InvestmentState);

// 2. Map out our operational nodes
workflow.addNode("resolver", resolverNode);
workflow.addNode("financials", financialsNode);
workflow.addNode("sentiment", sentimentNode);
workflow.addNode("cio", cioNode);

// 3. Draw the sequential progression paths (Edges)
workflow.addEdge(START, "resolver");
workflow.addEdge("resolver", "financials");
workflow.addEdge("financials", "sentiment");
workflow.addEdge("sentiment", "cio");
workflow.addEdge("cio", END);

// 4. Compile the blueprint into an active application engine
export const investmentAgentGraph = workflow.compile();