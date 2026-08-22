from typing import Dict, Any, List, Set
from app.passive.cert_transparency import cert_transparency_search


async def passive_subdomain_enum(domain: str, api_keys: Dict[str, str] = None) -> Dict[str, Any]:
    """Discover subdomains using passive sources."""
    all_subdomains: Set[str] = set()
    sources = {}

    # 1. Certificate Transparency
    ct_results = await cert_transparency_search(domain)
    ct_subs = ct_results.get("subdomains_found", [])
    all_subdomains.update(ct_subs)
    sources["certificate_transparency"] = {
        "count": len(ct_subs),
        "status": "success" if not ct_results.get("error") else "error",
    }

    # 2. Shodan (if API key available)
    api_keys = api_keys or {}
    if api_keys.get("shodan"):
        try:
            import httpx
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(
                    f"https://api.shodan.io/dns/domain/{domain}?key={api_keys['shodan']}"
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for record in data.get("data", []):
                        sub = record.get("subdomain", "")
                        if sub:
                            all_subdomains.add(f"{sub}.{domain}")
                    sources["shodan"] = {"count": len(data.get("data", [])), "status": "success"}
        except Exception:
            sources["shodan"] = {"count": 0, "status": "error"}

    return {
        "domain": domain,
        "subdomains": sorted(all_subdomains),
        "total": len(all_subdomains),
        "sources": sources,
    }
