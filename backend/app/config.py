from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://ramhub:ramhub@localhost:5432/ramhub"
    cors_origins: list[str] = ["http://localhost:3000"]
    # Vercel gives every preview deploy its own subdomain, so those are matched by pattern
    # rather than being added to cors_origins one at a time.
    cors_origin_regex: str | None = None
    jwt_secret: str = "dev-secret-change-me"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
