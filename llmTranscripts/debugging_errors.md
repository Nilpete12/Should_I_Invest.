LOG ENTRY 1 - Yahoo Finance and Gemini Rate limit error:
During the basic structuring of the states, nodes and other components, once completed, I ran a test which failed terribly. Apparently I insatlled the latest version of Yahoofinance api which no more allows the global import, therefore I had to make a separate const variable for it. 
Another error faced was for the rate limit, due to the error mentioned above the process kept on trying until it ran out of rate limits. To fix this I lowered down the model from gemini flash 3.5 to gemini flash 2.5.

LOG ENTRY 2 - 