import asyncio
import socket
from typing import Dict, Any, List
from app.scanners.base import BaseScanner


class PortScanner(BaseScanner):
    name = "port_scanner"

    COMMON_PORTS = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
        80: "HTTP", 110: "POP3", 111: "RPCBind", 135: "MSRPC", 139: "NetBIOS",
        143: "IMAP", 443: "HTTPS", 445: "SMB", 993: "IMAPS", 995: "POP3S",
        1433: "MSSQL", 1434: "MSSQL-Monitor", 1521: "Oracle", 3306: "MySQL",
        3389: "RDP", 5432: "PostgreSQL", 5900: "VNC", 6379: "Redis",
        8080: "HTTP-Proxy", 8443: "HTTPS-Alt", 8888: "HTTP-Alt",
        9090: "HTTP-Mgmt", 27017: "MongoDB",
    }

    def validate(self, target: str, options: Dict[str, Any] = None) -> bool:
        return True

    async def start(self, target: str, options: Dict[str, Any] = None) -> None:
        await super().start(target, options)
        opts = options or {}
        ports = opts.get("ports", list(self.COMMON_PORTS.keys()))
        timeout = opts.get("timeout", 2)

        results = []
        total = len(ports)
        for i, port in enumerate(ports):
            try:
                _, writer = await asyncio.wait_for(
                    asyncio.open_connection(target, port),
                    timeout=timeout,
                )
                writer.close()
                await writer.wait_closed()
                service = self.COMMON_PORTS.get(port, "unknown")
                results.append({
                    "host": target,
                    "port": port,
                    "protocol": "tcp",
                    "state": "open",
                    "service": service,
                    "version": "",
                    "source": "port_scanner",
                })
            except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
                pass
            self.progress = int((i + 1) / total * 100)

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
