from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "recon_platform"
    POSTGRES_USER: str = "recon_user"
    POSTGRES_PASSWORD: str = "change_me_in_production"

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # JWT
    SECRET_KEY: str = "change_me_to_a_random_secret_key_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Scanner
    MAX_CONCURRENT_SCANS: int = 5
    MAX_REQUESTS_PER_SECOND: int = 50
    SCAN_TIMEOUT: int = 300

    # API Keys
    SHODAN_API_KEY: str = ""
    CENSYS_API_KEY: str = ""
    VIRUSTOTAL_API_KEY: str = ""
    SECURITYTRAILS_API_KEY: str = ""

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def sync_database_url(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def redis_url(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
