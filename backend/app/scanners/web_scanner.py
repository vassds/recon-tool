import asyncio
from typing import Dict, Any, List
from app.scanners.base import BaseScanner


class WebScanner(BaseScanner):
    name = "web"

    def validate(self, target: str, options: Dict[str, Any] = None) -> bool:
        return True

    async def start(self, target: str, options: Dict[str, Any] = None) -> None:
        await super().start(target, options)
        # Use httpx if available, otherwise fallback to Python httpx
        try:
            import httpx
        except ImportError:
            self.errors.append("httpx not available")
            self.status = "failed"
            return

        urls = [target] if target.startswith("http") else [f"http://{target}", f"https://{target}"]
        results = []
        async with httpx.AsyncClient(verify=False, timeout=10, follow_redirects=True) as client:
            for url in urls:
                try:
                    resp = await client.get(url)
                    title = ""
                    if "<title>" in resp.text.lower():
                        import re
                        m = re.search(r"<title[^>]*>(.*?)</title>", resp.text, re.IGNORECASE | re.DOTALL)
                        if m:
                            title = m.group(1).strip()[:200]

                    results.append({
                        "url": str(resp.url),
                        "status_code": resp.status_code,
                        "title": title,
                        "server": resp.headers.get("server", ""),
                        "content_type": resp.headers.get("content-type", ""),
                        "response_size": len(resp.content),
                        "headers": dict(resp.headers),
                        "source": "httpx",
                    })
                except Exception as e:
                    self.errors.append(f"{url}: {str(e)}")

        self.results = results
        self.status = "completed"
        self.end_time = __import__("datetime").datetime.utcnow()
        self.progress = 100

    async def status(self) -> Dict[str, Any]:
        return await super().status()

    async def cancel(self) -> None:
        await super().cancel()

    def parse(self, raw_output: str) -> List[Dict[str, Any]]:
        return []

    def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return parsed_data
