# Stage 2

## Database Choice

I would use PostgreSQL because:

- Structured notification data
- ACID compliance
- Efficient indexing
- Good support for large datasets
- Reliable querying and sorting

## Schema

Students

| Column | Type |
|----------|----------|
| id | BIGINT |
| name | VARCHAR |
| email | VARCHAR |

Notifications

| Column | Type |
|----------|----------|
| id | UUID |
| studentId | BIGINT |
| notificationType | ENUM(Event, Result, Placement) |
| message | TEXT |
| isRead | BOOLEAN |
| createdAt | TIMESTAMP |

## Problems at Scale

- Large number of notifications
- Slow full table scans
- Increased storage requirements
- Higher query latency

## Solutions

- Index frequently queried columns
- Pagination
- Caching
- Database partitioning

## Sample Query

```sql
SELECT *
FROM notifications
WHERE studentId = 1042;