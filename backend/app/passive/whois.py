from typing import Dict, Any


async def whois_lookup(domain: str) -> Dict[str, Any]:
    """Perform a WHOIS lookup on a domain."""
    try:
        import whois
        w = whois.whois(domain)
        return {
            "domain": domain,
            "registrar": getattr(w, "registrar", None),
            "name_servers": getattr(w, "name_servers", []),
            "creation_date": str(getattr(w, "creation_date", "")),
            "expiration_date": str(getattr(w, "expiration_date", "")),
            "status": getattr(w, "status", []),
            "emails": getattr(w, "emails", []),
            "org": getattr(w, "org", None),
            "country": getattr(w, "country", None),
        }
    except Exception as e:
        return {"domain": domain, "error": str(e)}
