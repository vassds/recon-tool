import asyncio
from typing import Dict, Any, List
import dns.resolver
from app.scanners.base import BaseScanner


class DNSScanner(BaseScanner):
    name = "dns"
    RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "CAA", "SRV", "PTR"]

    def validate(self, target: str, options: Dict[str, Any] = None) -> bool:
        return True

    async def start(self, target: str, options: Dict[str, Any] = None) -> None:
        await super().start(target, options)
        record_types = (options or {}).get("record_types", self.RECORD_TYPES)
        loop = asyncio.get_event_loop()
        results = []
        for rt in record_types:
            try:
                answers = await loop.run_in_executor(None, lambda: dns.resolver.resolve(target, rt))
                for rdata in answers:
                    results.append({
                        "domain": target,
                        "record_type": rt,
                        "record_value": str(rdata),
                        "ttl": rdata.expiration if hasattr(rdata, "expiration") else None,
                        "source": "dns",
                    })
            except Exception:
                continue
            self.progress = int((self.RECORD_TYPES.index(rt) + 1) / len(record_types) * 100)

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
