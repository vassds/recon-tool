import httpx
from typing import Dict, Any, List


async def cert_transparency_search(domain: str) -> Dict[str, Any]:
    """Search Certificate Transparency logs for subdomains."""
    url = f"https://crt.sh/?q=%25.{domain}&output=json"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            certs = resp.json()

        # Deduplicate subdomains
        subdomains = set()
        cert_details = []
        for cert in certs:
            name = cert.get("name_value", "")
            for n in name.split("\n"):
                n = n.strip().lower()
                if n.endswith(f".{domain}") or n == domain:
                    subdomains.add(n)
            cert_details.append({
                "id": cert.get("id"),
                "common_name": cert.get("common_name", ""),
                "issuer": cert.get("issuer_name", ""),
                "not_before": cert.get("not_before", ""),
                "not_after": cert.get("not_after", ""),
                "name_value": cert.get("name_value", ""),
            })

        return {
            "domain": domain,
            "subdomains_found": sorted(subdomains),
            "certificates": cert_details[:50],
            "source": "crt.sh",
        }
    except Exception as e:
        return {"domain": domain, "error": str(e), "subdomains_found": [], "certificates": []}
