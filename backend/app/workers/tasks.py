from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="run_scan")
def run_scan_task(self, scan_id: str):
    """Execute a scan pipeline in the background worker."""
    import asyncio
    from app.services.scan_pipeline import run_scan_pipeline
    from app.database import async_session

    async def _run():
        await run_scan_pipeline(scan_id, async_session)

    asyncio.run(_run())
