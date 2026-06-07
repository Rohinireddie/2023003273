# Stage 2

## Database Choice

I would use PostgreSQL as the persistent storage database because:

* Structured notification data fits well in a relational database.
* ACID compliance ensures reliability and consistency.
* Efficient indexing support for large datasets.
* Strong querying and sorting capabilities.
* Scales well for notification management systems.

## Database Schema

### Students Table

| Column | Type    |
| ------ | ------- |
| id     | BIGINT  |
| name   | VARCHAR |
| email  | VARCHAR |

### Notifications Table

| Column           | Type                           |
| ---------------- | ------------------------------ |
| id               | UUID                           |
| studentId        | BIGINT                         |
| notificationType | ENUM(Event, Result, Placement) |
| message          | TEXT                           |
| isRead           | BOOLEAN                        |
| createdAt        | TIMESTAMP                      |

## Problems at Scale

As the number of notifications grows:

* Large notification volumes increase storage requirements.
* Full table scans become slower.
* Query latency increases.
* Sorting and filtering operations become expensive.

## Solutions

* Create indexes on frequently queried columns.
* Implement pagination.
* Use caching (Redis).
* Partition notification tables by date or user ranges.
* Archive old notifications.

## Sample Query

```sql
SELECT *
FROM notifications
WHERE studentId = 1042
ORDER BY createdAt DESC;
```

## APIs

### Get Notifications

**Endpoint**

```
GET /notifications
```

**Response**

```json
{
  "notifications": []
}
```

### Get Priority Notifications

**Endpoint**

```
GET /priority-notifications
```

**Response**

```json
{
  "notifications": []
}
```

# Stage 3

## Query Analysis

### Original Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Why Is It Slow?

The database contains:

* 50,000 students
* 5,000,000 notifications

Without proper indexes, the database performs a full table scan which significantly increases query execution time.

### Better Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

### Expected Cost

Query performance improves from approximately:

```
O(N) → O(log N)
```

### Should Every Column Be Indexed?

No.

Adding indexes on every column:

* Increases storage consumption.
* Slows INSERT and UPDATE operations.
* Increases maintenance overhead.

Indexes should only be created on frequently queried columns.

### Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

# Stage 4

## Improving Performance

### Current Problem

Notifications are fetched from the database on every page load, increasing database load and response times.

### Proposed Solutions

#### Pagination

* Load notifications in smaller chunks.
* Reduces database load.

#### Redis Cache

* Frequently accessed notifications are served from cache.
* Improves response time.

#### Lazy Loading

* Load additional notifications only when required.
* Improves user experience.

#### CDN

* Deliver static assets efficiently.

### Tradeoffs

#### Pagination

Pros:

* Lower DB load.
* Faster queries.

Cons:

* Additional API complexity.

#### Caching

Pros:

* Extremely fast responses.
* Reduced database traffic.

Cons:

* Cache invalidation complexity.

#### Lazy Loading

Pros:

* Better frontend performance.

Cons:

* Additional frontend implementation effort.

# Stage 5

## Problems With Current notify_all()

Current implementation:

* Sequential processing.
* Slow execution.
* Email failures may interrupt processing.
* Not scalable for 50,000 users.

## Improved Design

Use an asynchronous message queue.

### Workflow

1. Save notification to database.
2. Publish event to queue.
3. Worker processes queue.
4. Send email notification.
5. Send push notification.

### Benefits

* Reliable.
* Scalable.
* Fault tolerant.
* Supports retries.
* Decouples notification delivery from API response.

### Revised Pseudocode

```text
notify_all(student_ids, message)

for each student:
    save_to_db(student, message)
    publish_to_queue(student, message)

worker:
    send_email()
    send_push_notification()
```

# Stage 6

## Priority Notification Logic

### Priority Weights

| Type      | Weight |
| --------- | ------ |
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

### Recency Bonus

Newer notifications receive higher scores.

### Formula

```text
priorityScore = typeWeight + recencyWeight
```

## Data Structure Used

A Min Heap of size N is maintained.

### Advantages

* Efficient retrieval of top priority notifications.
* Complexity: O(n log N).
* Handles continuous arrival of new notifications.
* Memory efficient for large datasets.

# Stage 7

## Frontend Features Implemented

### Notifications Page

* Displays notifications.
* Filter by notification type.
* Top N notifications selection.
* Read/Unread status indicator.
* Material UI based design.

### Priority Notifications Page

* Displays highest priority notifications.
* Uses priority scoring logic.
* Separate route/page.
* Responsive UI.

## Technologies Used

### Backend

* Node.js
* Express.js
* TypeScript
* Axios

### Frontend

* React
* TypeScript
* Material UI

## Logging Middleware

Implemented reusable logging middleware:

```text
Log(stack, level, package, message)
```

The middleware sends logs to the provided evaluation server and is integrated throughout the backend application.
