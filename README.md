# :guard: RATE LIMITER

- Limit the number of requests sent to your web server from the client side
- If the API request count exceeds the number of requests count set by the limiter, the subsequent requests are blocked.
- A single server implementation since this kind of thing is better off handled by an API gateway
- API gateway can handle tasks including:

  - Rate Limiting
  - IP Whitelisting
  - Authentication
  - SSL Termination
  - Logging / Metrics etc

## Why? :man_shrugging:

- Prevent resource starvation caused by DDOS attacks.
- Prevent server overload.
- Keep costs at bay esp while using 3rd party APIs which charge based on the number of requests made.

## How? :thinking:

- Throttle based on userId.
- Inform throttled users.
- Rate limiter implemented as a middleware on the server side.
- Store number of requests made on a counter in Redis Cache.
- Monitoring feature to ensure rate limiter works correctly.

Client makes API request, middleware gets counter from Redis, checks if limit is exceeded, if not request sent to web servers and counter increased by one. If exceeded, request sent to message queue for execution once the counter is reset.

Config rules to be regularly updated by a worker service.

## Disclaimers :yawning_face:

- A minified rate limiter to be used on a single server - can't apply to a distributed environment.
  _to look at a distributed rate limiter later_

## Solution Overview

- Auth Service - authentication through email + password = jwt
- Random Service - house requests - to include the rate limiter
- Bench Service - send unprocessed requests here which are processed after the throttle time period has expired
- Worker Service - Periodically update the throttle time on the Random Service and Bench Service.

_TDD used for development process_

## Technologies Used :technologist:

- Nodejs
- Redis
- MongoDB
- NATS Streaming Server (will be replaced later on by Apache Kafka as the message broker)
