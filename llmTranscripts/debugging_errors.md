### Debugging errors.

# Log Entry 01: Mitigating Upstream Rate-Limits & Multi-Minute Server Hangs
1. System Bug Encountered:
Terminal Error Log Output: POST /api/research 500 in 4.7min along with upstream 429 Rate Limit Reached codes.

Context: The server locked up completely and became unresponsive for nearly 5 minutes before throwing an internal timeout exception.

2. Root Cause Analysis
Using experimental or highly throttled free-tier models (like gemini-3.5-flash) frequently triggers rate limit blocks during rapid multi-agent development loops. Because LangChain implements an exponential backoff retry loop by default when hitting a 429 error, it continuously waited and retried, hanging the Next.js server threads.

3. Rectification Resolution
Downgraded the model configuration to the highly stable production tier gemini-3.5-flash-lite. To prevent future network hangs, we hard-capped the connection rules by injecting maxRetries: 1 directly into the class initializer settings.

# Log Entry 02: Resolving Next.js Turbopack Module Resolution Conflicts
1. System Bug Encountered
Terminal Error Log Output: CssSyntaxError: tailwindcss: globals.css: "./plugin" is not exported under the condition "style"

Context: The application completely failed its production compilation phase (npm run build), blocking deployment execution due to a Next.js Turbopack builder error.

2. Root Cause Analysis
Tailwind v4 implements a new CSS-first design system that removes the traditional tailwind.config.js file. When compiling on specific OS disk configurations, Next.js's Turbopack engine fails to resolve JavaScript-based CSS plugins (like @tailwindcss/typography) when declared via the new @plugin directive inside global stylesheets.

3. Rectification Resolution
Completely removed the JavaScript plugin dependency call from src/app/globals.css. Built a custom, pure-CSS responsive typography style sheet layout inside globals.css using standard Tailwind utility maps via the @apply compilation directive, restoring build stability.

# Log Entry 03: Resolving Data Drops for International Equities (e.g., Tata Motors)
1. System Bug Encountered
Terminal Error Log Output: Fatal error gathering data for TATAMOTORS.NS: No fundamental market data discovered...

Context: Looking up valid Indian equities resulted in an unexpected data drop, which triggered our CIO safety guardrail and forced a continuous, unwarranted PASS outcome.

2. Root Cause Analysis
Yahoo Finance handles non-US exchange data structures differently, causing the quoteSummary module to return unexpected payloads that crash standard schema models. Additionally, the resolver agent lacked guidance on managing global tickers, meaning searches for companies like "Tata" defaulted to incorrect US market symbols (like TCS for The Container Store).

3. Rectification Resolution
Search-Index Grounding: Upgraded the resolverNode to query Yahoo Finance's live search database index before running LLM processing. This provides verified ticker records to the model instead of relying on open text inference.

Cascading Fallback Pipeline: Re-engineered financeTool.js into a 3-tier extraction engine. It sequentially tests quoteSummary modules, falls back to basic quotes, and relies on search indexes if deeper balance sheets degrade, ensuring 100% data framework resilience.

# Log Entry 04: Bypassing Legacy Model 404 Gating on New Project 
1. System Bug Encountered
Terminal Error Log Output: [GoogleGenerativeAI Error]: Error fetching from ... models/gemini-2.5-flash:generateContent: [404 Not Found] This model models/gemini-2.5-flash is no longer available to new users.`

Context: Graph routing halted immediately during execution tests upon migrating the application context to a newly provisioned, project-specific Google AI Studio API key.

2. Root Cause Analysis
Google automatically enforces strict structural API architectural limits on newly generated developer projects. While existing API configurations retain access to legacy tiers, new security identifiers throw a 404 when requesting retired modules, requiring an immediate transition to the current model generation layer.

3. Rectification Resolution
Upgraded the core backend LLM instance wrapper in `src/lib/agentNodes.js` to point directly to the flagship production engine: `gemini-3.5-flash-litw`. This completely eliminated the credential validation block, bypassed the 404 exception, and optimized the parallel step execution speed across our LangGraph node network.
