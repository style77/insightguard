import time
from fastapi import Request, HTTPException
from redis.asyncio import Redis


class RateLimiter:
    """
    Rate limiter middleware.

    :param rate_limit: number of requests allowed per rate_limit_window.
    :param rate_limit_window: time window in seconds.
    :param redis_client: redis client.
    """

    def __init__(self, rate_limit: int, rate_limit_window: int, redis_client: Redis):
        self.rate_limit = rate_limit
        self.rate_limit_window = rate_limit_window
        self.redis_client = redis_client

    async def __call__(self, request: Request) -> None:
        # Get the API key from the request headers
        api_key = request.headers.get("X-API-KEY")
        if not api_key:
            raise HTTPException(status_code=400, detail="API key not provided")

        # Check if the API key has exceeded the rate limit
        current_time = int(time.time())
        key = f"api:{api_key}"
        request_count = await self.redis_client.get(key)
        if request_count is not None and int(request_count) >= self.rate_limit:
            reset_time = int(await self.redis_client.ttl(key))
            raise HTTPException(
                status_code=429,
                detail=f"API key {api_key} has exceeded the rate limit of {self.rate_limit} requests per {self.rate_limit_window} seconds. "
                f"Please try again in {reset_time} seconds.",
                headers={"Retry-After": str(reset_time)},
            )

        # Increment the request count and set the expiry time
        await self.redis_client.incr(key)
        await self.redis_client.expire(key, self.rate_limit_window)
