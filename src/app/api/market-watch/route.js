import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET() {
  try {
    const targetTickers = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN'];
    
    // Fetch summaries for all top tickers in parallel for optimal latency
    const quotes = await Promise.all(
      targetTickers.map(async (ticker) => {
        try {
          const summary = await yahooFinance.quote(ticker);
          return {
            ticker,
            price: summary.regularMarketPrice || 0,
            changePercent: summary.regularMarketChangePercent || 0,
          };
        } catch {
          return { ticker, price: 0, changePercent: 0 };
        }
      })
    );

    return NextResponse.json({ success: true, marketData: quotes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}