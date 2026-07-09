import yahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
/**
 * Fetches core quantitative financial metrics for a specific stock ticker.
 * @param {string} ticker - The stock ticker symbol (e.g., 'AAPL', 'TSLA').
 */
export async function getFinancialSummary(ticker) {
  try {
    // Fetch summary profile and key statistics simultaneously
    const results = await yahooFinance.quoteSummary(ticker, {
      modules: ['summaryDetail', 'financialData', 'defaultKeyStatistics']
    });

    if (!results) {
      throw new Error(`No financial data discovered for ticker: ${ticker}`);
    }

    return {
      success: true,
      ticker: ticker.toUpperCase(),
      marketCap: results.summaryDetail?.marketCap || 'N/A',
      peRatio: results.summaryDetail?.trailingPE || 'N/A',
      forwardPe: results.summaryDetail?.forwardPE || 'N/A',
      profitMargins: results.financialData?.profitMargins || 'N/A',
      revenueGrowth: results.financialData?.revenueGrowth || 'N/A',
      totalDebt: results.financialData?.totalDebt || 'N/A',
      freeCashFlow: results.financialData?.freeCashFlow || 'N/A'
    };
  } catch (error) {
    console.error(`Error gathering data for ${ticker}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
} 