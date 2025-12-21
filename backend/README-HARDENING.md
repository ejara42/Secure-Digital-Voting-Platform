Production hardening notes

1) Rate limiting
- The middleware `backend/middleware/rateLimiter.js` uses Redis when `REDIS_URL` is set and `rate-limit-redis` + `redis` packages are available.
- To enable distributed rate limiting in production, set `REDIS_URL=redis://:password@host:6379` in your environment.

2) SMTP
- Configure `EMAIL_USER`, `EMAIL_PASS`, and set SMTP host/port in `backend/utils/email.js` via environment variables for production use.

3) OTP policy
- Current OTP length: 6 digits; expiry: 10 minutes. Consider shorter expiry (2-5 minutes) and rate-limit OTP requests per user.

4) Tests and CI
- CI updated to install devDependencies and run integration tests that use `mongodb-memory-server`.

5) Audit archival (S3)
- To enable archival of audit logs to S3, set the following environment variables in production (or CI for the scheduled archival job):
	- `AUDIT_S3_BUCKET` - the S3 bucket name where exported audits will be stored (e.g. `my-org-audit-bucket`).
	- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - AWS credentials with least-privilege (s3:PutObject for archival; s3:GetObject/ListBucket for presign/listing).
	- `AWS_REGION` (optional) - AWS region for the bucket (defaults to `us-east-1`).
	- `AUDIT_PRESIGN_EXPIRES` (optional) - presigned URL TTL in seconds (defaults to 3600).

- The admin API exposes these endpoints (admin-only):
	- `GET /api/admin/audit/list` — list archived objects (accepts `prefix`, `limit`, `continuationToken`).
	- `GET /api/admin/audit/presign?key=...` — return a presigned GET URL for a stored audit file.
	- `POST /api/admin/audit/archive` — trigger an on-demand archive of current audits to S3.

- For scheduled archival, a GitHub Actions workflow `/.github/workflows/archive-audits.yml` is included; configure repository secrets `MONGO_URI`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AUDIT_S3_BUCKET` to enable it.

6) Testing the archival feature locally
- Because S3 credentials are required to test archival against real S3, use one of the following strategies in CI/local testing:
	- Use LocalStack or a Dockerized S3-compatible service and set `AWS_ENDPOINT` to point at it.
	- Mock the AWS SDK in unit tests (examples in `backend/tests/integration` show mocking for presign/list endpoints).

7) Security notes
- Do not commit AWS credentials to source control. Use environment variables or a secret store. Limit S3 permissions to the specific bucket/prefix used for audits.

