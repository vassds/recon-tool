from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime


class BaseScanner(ABC):
    """Base class for all scanner adapters.

    Every tool adapter must implement:
      - validate(): check if the tool is available and target is valid
      - start(): begin the scan
      - status(): get current status
      - cancel(): abort the scan
      - parse(): parse raw tool output
      - normalize(): convert to unified schema
    """

    name: str = "base"
    version: str = "1.0"

    def __init__(self):
        self.status = "idle"
        self.start_time: Optional[datetime] = None
        self.end_time: Optional[datetime] = None
        self.results: List[Dict[str, Any]] = []
        self.errors: List[str] = []
        self.progress: int = 0

    @abstractmethod
    def validate(self, target: str, options: Dict[str, Any] = None) -> bool:
        """Validate that the tool is available and the target is acceptable."""
        pass

    @abstractmethod
    async def start(self, target: str, options: Dict[str, Any] = None) -> None:
        """Begin the scan."""
        self.status = "running"
        self.start_time = datetime.utcnow()
        self.progress = 0

    @abstractmethod
    async def status(self) -> Dict[str, Any]:
        """Return current scan status."""
        return {
            "name": self.name,
            "status": self.status,
            "progress": self.progress,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "result_count": len(self.results),
            "error_count": len(self.errors),
        }

    @abstractmethod
    async def cancel(self) -> None:
        """Cancel the scan."""
        self.status = "cancelled"
        self.end_time = datetime.utcnow()

    @abstractmethod
    def parse(self, raw_output: str) -> List[Dict[str, Any]]:
        """Parse raw tool output into structured data."""
        pass

    @abstractmethod
    def normalize(self, parsed_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Convert parsed data to the unified internal schema."""
        pass
