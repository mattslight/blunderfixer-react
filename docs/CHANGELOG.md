## Epic 1: Game-Archive Pipeline

**Goal:** Reliably fetch and store every user’s Chess.com games for downstream processing.

**Backend User Stories:**

- [x] **Enqueue Fetch Jobs:**  
       As the system, I want to enqueue a fetch-jobs task whenever a user logs in so that their latest games are pulled in the background.
- [x] **Download Game Archives:**  
       As the system, I want to download paginated Chess.com archives (by username) and persist the raw JSON/PGN to object storage or a `games` table.
- [x] **Record Fetch Metadata:**  
       As the system, I want to record metadata (fetch timestamp, archive URL, status) so I can retry failures and track freshness.

---
