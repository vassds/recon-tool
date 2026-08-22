import asyncio
import shutil
import re
from typing import Dict, Any, List, Optional
from app.scanners.base import BaseScanner


class NmapScanner(BaseScanner):
    name = "nmap"

    PROFILES = {
        "quick": "-T4 -F --top-ports 100",
        "standard": "-T4 -sV -sC --top-ports 1000",
        "full_tcp": "-T4 -sV -sC -p-",
        "service_detection": "-T4 -sV -sC -A",
    }

    def validate(self, target: str, options: Dict[str, Any] = None) -> bool:
        if not shutil.which("nmap"):
            self.errors.append("nmap not found in PATH")
            return False
        return True

    async def start(self, target: str, options: Dict[str, Any] = None) -> None:
        await super().start(target, options)
        options = options or {}
        profile = options.get("profile", "standard")
        flags = self.PROFILES.get(profile, self.PROFILES["standard"])

        cmd = f"nmap {flags} -oX - {target}"
        try:
            process = await asyncio.create_subprocess_shell(
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await process.communicate()
            if process.returncode == 0:
                self.results = self.parse(stdout.decode(errors="replace"))
                self.status = "completed"
            else:
                self.errors.append(stderr.decode(errors="replace"))
                self.status = "failed"
        except Exception as e:
            self.errors.append(str(e))
            self.status = "failed"
        self.end_time = __import__("datetime").datetime.utcnow()
        self.progress = 100

    async def status(self) -> Dict[str, Any]:
        base = await super().status()
        base["tool"] = self.name
        return base

    async def cancel(self) -> None:
        await super().cancel()

    def parse(self, raw_output: str) -> List[Dict[str, Any]]:
        """Basic XML-free parser for nmap text output as fallback."""
        results = []
        current_host = None
        for line in raw_output.split("\n"):
            line = line.strip()
            host_match = re.match(r"Nmap scan report for\s+(.+?)(?:\s+\((\d+\.\d+\.\d+\.\d+)\))?$", line)
            if host_match:
                current_host = host_match.group(1)
                continue

            port_match = re.match(r"(\d+)/(tcp|udp)\s+(open|filtered|closed)\s+(\S+)(?:\s+(.*))?", line)
            if port_match and current_host:
                results.append({
                    "host": current_host,
                    "port": int(port_match.group(1)),
                    "protocol": port_match.group(2),
                    "state": port_match.group(3),
                    "service": port_match.group(4),
                    "version": (port_match.group(5) or "").strip(),
                    "source": "nmap",
                })
        return results

    def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in parsed_data:
            normalized.append({
                "asset": item.get("host", ""),
                "ip": None,
                "port": item.get("port"),
                "protocol": item.get("protocol", "tcp"),
                "service": item.get("service", ""),
                "version": item.get("version", ""),
                "state": item.get("state", "open"),
                "technology": None,
                "source": "nmap",
                "timestamp": self.start_time.isoformat() if self.start_time else None,
            })
        return normalized
