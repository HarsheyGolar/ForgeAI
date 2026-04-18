# import ddgs
# from duckduckgo_search import DDGS
from ddgs import DDGS

def get_web_results(query: str, max_results: int = 3):
    print(f"Searching the web for: {query}....")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))

            if results:
                return results
            else:
                return [{"title": "No results","body": "could not find anything on the web"}]
    except Exception as e:
        print(f"Error during search: {e}")
        return [{"title": "Error", "body" : "Search failed due to an error."}]
    
if __name__=="__main__":
    test_query = "what is the latest news about AI in 2026."
    search_data = get_web_results(test_query)

    for i, res in enumerate(search_data):
        print(f"\nResults {i}: ")
        print(f"Title: {res.get('title')}")
        print(f"Link: {res.get('href')}")
        print(f"Snippet: {res.get('body')}")
