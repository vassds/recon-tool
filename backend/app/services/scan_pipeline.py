"""Scan Pipeline Orchestrator

Chains reconnaissance stages together. Each stage can be independently
enabled/disabled. If one stage fails, subsequent stages still run.
"""
import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.scan import ScanJob, ScanLog
from app.models.target import Target
from app.models.dns import DNSRecord
from app.models.subdomain import Subdomain
from app.models.port import Port, Service
from app.models.technology import Technology
from app.models.web import URL
from app.models.finding import Finding

logger = logging.getLogger(__name__)


def _log_scan(db: AsyncSession, scan_id: str, level: str, stage: str, message: str):
    """Write a scan log entry."""
    log = ScanLog(scan_id=scan_id, level=level, stage=stage, message=message)
    db.add(log)


async def run_scan_pipeline(scan_id: str, db_factory):
    """Execute the full scan pipeline for a given scan job."""
    async with db_factory() as db:
        result = await db.execute(select(ScanJob).where(ScanJob.scan_id == scan_id))
        scan = result.scalar_one_or_none()
        if not scan:
            logger.error(f"Scan {scan_id} not found")
            return

        target_result = await db.execute(select(Target).where(Target.id == scan.target_id))
        target = target_result.scalar_one_or_none()
        if not target:
            scan.status = "failed"
            scan.error_message = "Target not found"
            await db.commit()
            return

        scan.status = "running"
        scan.started_at = datetime.utcnow()
        await db.commit()

        stages = scan.stages_config or {}
        target_value = target.value
        stages_completed = 0
        total_stages = sum(1 for v in stages.values() if v)

        try:
            # Stage 1: Passive Recon (WHOIS)
            if stages.get("passive_recon"):
                scan.current_stage = "passive_recon"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "passive_recon", "Starting passive reconnaissance")
                await db.commit()

                try:
                    from app.passive.whois import whois_lookup
                    whois_data = await whois_lookup(target_value)
                    _log_scan(db, scan_id, "INFO", "passive_recon", f"WHOIS lookup completed: {whois_data.get('registrar', 'N/A')}")
                    await db.commit()
                except Exception as e:
                    _log_scan(db, scan_id, "WARNING", "passive_recon", f"WHOIS failed: {e}")
                    await db.commit()
                stages_completed += 1
                scan.progress = int(stages_completed / total_stages * 100)
                await db.commit()

            # Stage 2: DNS Intelligence
            if stages.get("dns_intelligence"):
                scan.current_stage = "dns_intelligence"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "dns_intelligence", "Starting DNS enumeration")
                await db.commit()

                try:
                    from app.scanners.dns_scanner import DNSScanner
                    scanner = DNSScanner()
                    if scanner.validate(target_value):
                        await scanner.start(target_value)
                        for record in scanner.results:
                            db.add(DNSRecord(
                                scan_id=scan_id,
                                project_id=scan.project_id,
                                target_id=scan.target_id,
                                domain=record["domain"],
                                record_type=record["record_type"],
                                record_value=record["record_value"],
                                source="dns",
                            ))
                        _log_scan(db, scan_id, "INFO", "dns_intelligence", f"Found {len(scanner.results)} DNS records")
                        await db.commit()
                except Exception as e:
                    _log_scan(db, scan_id, "WARNING", "dns_intelligence", f"DNS enumeration failed: {e}")
                    await db.commit()
                stages_completed += 1
                scan.progress = int(stages_completed / total_stages * 100)
                await db.commit()

            # Stage 3: Subdomain Discovery
            if stages.get("subdomain_discovery"):
                scan.current_stage = "subdomain_discovery"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "subdomain_discovery", "Starting subdomain discovery")
                await db.commit()

                try:
                    from app.passive.subdomain_discovery import passive_subdomain_enum
                    sub_results = await passive_subdomain_enum(target_value)
                    for subdomain_name in sub_results.get("subdomains", []):
                        db.add(Subdomain(
                            scan_id=scan_id,
                            project_id=scan.project_id,
                            target_id=scan.target_id,
                            hostname=subdomain_name,
                            source="passive",
                        ))
                    _log_scan(db, scan_id, "INFO", "subdomain_discovery", f"Found {sub_results.get('total', 0)} subdomains")
                    await db.commit()
                except Exception as e:
                    _log_scan(db, scan_id, "WARNING", "subdomain_discovery", f"Subdomain discovery failed: {e}")
                    await db.commit()
                stages_completed += 1
                scan.progress = int(stages_completed / total_stages * 100)
                await db.commit()

            # Stage 4: Active Recon / Port Scan
            if stages.get("port_scan") or stages.get("active_recon"):
                scan.current_stage = "port_scan"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "port_scan", "Starting port scan")
                await db.commit()

                try:
                    from app.scanners.port_scanner import PortScanner
                    scanner = PortScanner()
                    if scanner.validate(target_value):
                        profile = scan.profile or "standard"
                        await scanner.start(target_value, {"profile": profile})
                        for port_data in scanner.results:
                            db.add(Port(
                                scan_id=scan_id,
                                project_id=scan.project_id,
                                target_id=scan.target_id,
                                host=port_data["host"],
                                port_number=port_data["port"],
                                protocol=port_data.get("protocol", "tcp"),
                                state=port_data.get("state", "open"),
                                service_name=port_data.get("service"),
                                source="port_scanner",
                            ))
                        _log_scan(db, scan_id, "INFO", "port_scan", f"Found {len(scanner.results)} open ports")
                        await db.commit()
                except Exception as e:
                    _log_scan(db, scan_id, "WARNING", "port_scan", f"Port scan failed: {e}")
                    await db.commit()
                stages_completed += 1
                scan.progress = int(stages_completed / total_stages * 100)
                await db.commit()

            # Stage 5: Web Recon
            if stages.get("web_recon"):
                scan.current_stage = "web_recon"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "web_recon", "Starting web reconnaissance")
                await db.commit()

                try:
                    from app.scanners.web_scanner import WebScanner
                    scanner = WebScanner()
                    if scanner.validate(target_value):
                        await scanner.start(target_value)
                        for web_data in scanner.results:
                            db.add(URL(
                                scan_id=scan_id,
                                project_id=scan.project_id,
                                target_id=scan.target_id,
                                url=web_data["url"],
                                domain=target_value,
                                status_code=web_data.get("status_code"),
                                title=web_data.get("title"),
                                server=web_data.get("server"),
                                content_type=web_data.get("content_type"),
                                response_size=web_data.get("response_size"),
                                source="httpx",
                            ))
                        _log_scan(db, scan_id, "INFO", "web_recon", f"Probed {len(scanner.results)} web services")
                        await db.commit()
                except Exception as e:
                    _log_scan(db, scan_id, "WARNING", "web_recon", f"Web recon failed: {e}")
                    await db.commit()
                stages_completed += 1
                scan.progress = int(stages_completed / total_stages * 100)
                await db.commit()

            # Stage 6: Technology Detection
            if stages.get("tech_detection"):
                scan.current_stage = "tech_detection"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "tech_detection", "Starting technology detection")
                await db.commit()
                stages_completed += 1
                scan.progress = int(stages_completed / total_stages * 100)
                await db.commit()

            # Stage 7: Finding Correlation
            if stages.get("finding_correlation"):
                scan.current_stage = "finding_correlation"
                await db.commit()
                _log_scan(db, scan_id, "INFO", "finding_correlation", "Correlating findings")
                await db.commit()
                stages_completed += 1
                scan.progress = 100
                await db.commit()

            scan.status = "completed"
            scan.completed_at = datetime.utcnow()
            scan.current_stage = "done"
            _log_scan(db, scan_id, "INFO", "pipeline", f"Scan completed successfully")
            await db.commit()

        except Exception as e:
            logger.exception(f"Scan {scan_id} failed: {e}")
            scan.status = "failed"
            scan.error_message = str(e)
            scan.completed_at = datetime.utcnow()
            _log_scan(db, scan_id, "ERROR", "pipeline", f"Scan failed: {e}")
            await db.commit()
