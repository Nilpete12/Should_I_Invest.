import { NextResponse } from 'next/server';
import { investmentAgentGraph } from '@/lib/investmentGraph';

export async function POST(request) {
  try {
    const body = await request.json();
    const { companyName } = body; // Can accept text entry now: e.g. "Google" or "Microsoft"

    if (!companyName) {
      return NextResponse.json({ error: 'Company query is required.' }, { status: 400 });
    }

    // Fire up the graph sequence by feeding the initial state parameters
    const initialInput = { companyInput: companyName };
    const resultState = await investmentAgentGraph.invoke(initialInput);

    // LangGraph responds back with the final, complete state folder
    return NextResponse.json({
      success: true,
      ticker: resultState.ticker,
      financials: resultState.financialData,
      sentiment: resultState.marketSentiment,
      decision: resultState.decision,
      report: resultState.reasoningMarkdown
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}