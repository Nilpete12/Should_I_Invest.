import YahooFinance from 'yahoo-finance2';

// Initialize the YahooFinance instance (Required in newer versions)
const yahooFinance = new YahooFinance();

export async function getFinancialSummary(ticker) {
  try {
    // Call methods directly on your new instance variable
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