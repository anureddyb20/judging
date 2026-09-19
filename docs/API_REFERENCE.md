# VICEVERSE REST API Reference

All API routes are served under the `/api/` endpoint in the Next.js server runtime.

---

## 1. System Health

### `GET /api/health`
Returns the operational telemetry status of the VICEVERSE backend services.

**Response `200 OK`**:
```json
{
  "status": "ONLINE",
  "system": "VICEVERSE // THE INNOVATION HEIST",
  "timestamp": "2026-09-19T10:30:00.000Z",
  "version": "2.6.0",
  "encryption": "AES-256-GCM",
  "realtime": "ACTIVE"
}
```

---

## 2. Authoritative Scoring

### `POST /api/score/calculate`
Calculates evaluation scores or team aggregates based on rubric criteria weights and aggregation modes.

**Request Body (Evaluation Mark)**:
```json
{
  "scores": [
    { "criterion_id": "c1", "score": 19.0 },
    { "criterion_id": "c2", "score": 18.5 }
  ],
  "criteria": [
    { "id": "c1", "max_marks": 20, "weight": 1.0 },
    { "id": "c2", "max_marks": 20, "weight": 1.0 }
  ],
  "scoringMethod": "average"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "score": 37.5
}
```

---

## 3. Teams & Squads

### `GET /api/teams`
Returns the list of registered squads and operative rosters.

**Response `200 OK`**:
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": "t14",
      "team_code": "VV-014",
      "name": "SYNTHETIC VANGUARD",
      "mission_id": "m1",
      "status": "active",
      "members": [...]
    }
  ]
}
```

---

## 4. Evaluations

### `GET /api/evaluations`
Retrieves completed evaluations filtered by `teamId` or `judgeId`.

**Query Parameters**:
- `teamId` (optional): Filter reviews for a specific squad.
- `judgeId` (optional): Filter reviews submitted by a specific judge.

---

## 5. Event Policies & Settings

### `GET /api/admin/settings`
Returns active event phase, deadlines, and score visibility flags (`show_live_score`, `show_leaderboard`, `anonymous_judging`).
