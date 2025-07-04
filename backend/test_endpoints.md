# New Lending Endpoints Documentation

## Changes Made

### 1. **New Status Added: `returned_late`**

-   When an overdue book is returned, it now gets status `returned_late` instead of `returned`
-   This preserves the information that the book was returned late
-   Both `returned` and `returned_late` books increase stock when returned

### 2. **New API Endpoints**

#### **GET /api/lending/stats** (User's own statistics)

Returns lending statistics for the authenticated user:

```json
{
    "success": true,
    "data": {
        "total_lendings": 10,
        "on_time_returns": 7,
        "late_returns": 2,
        "currently_overdue": 0,
        "pending_approval": 1,
        "currently_borrowed": 0,
        "rejected": 0,
        "completion_rate": 90.0,
        "on_time_rate": 77.78
    },
    "message": "User lending statistics retrieved successfully."
}
```

#### **GET /api/lending/stats/all** (Admin only)

Returns lending statistics for all users:

```json
{
    "success": true,
    "data": {
        "overall_statistics": {
            "total_users_with_lendings": 5,
            "total_lendings": 50,
            "total_on_time_returns": 35,
            "total_late_returns": 10,
            "total_currently_overdue": 2,
            "total_pending_approval": 1,
            "total_currently_borrowed": 2,
            "total_rejected": 0,
            "overall_completion_rate": 90.0,
            "overall_on_time_rate": 77.78
        },
        "user_statistics": [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "uid": "12345",
                "total_lendings": 10,
                "on_time_returns": 7,
                "late_returns": 2,
                "currently_overdue": 0,
                "pending_approval": 1,
                "currently_borrowed": 0,
                "rejected": 0,
                "completion_rate": 90.0,
                "on_time_rate": 77.78
            }
        ]
    },
    "message": "All users lending statistics retrieved successfully."
}
```

### 3. **Status Flow Updated**

-   `pending` → `claim` (approved) → `returned` (on time) ✅
-   `pending` → `claim` (approved) → `overdue` (past due) → `returned_late` (late return) ✅
-   `pending` → `reject` (rejected) ✅

### 4. **Testing the Endpoints**

**For user stats:**

```bash
curl -X GET "http://localhost:8000/api/lending/stats" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**For admin stats:**

```bash
curl -X GET "http://localhost:8000/api/lending/stats/all" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 5. **Database Status Values**

-   `pending`: Waiting for admin approval
-   `claim`: Approved and book can be picked up
-   `overdue`: Book return date has passed
-   `returned`: Book returned on time
-   `returned_late`: Book returned after being overdue
-   `reject`: Lending request rejected

The statistics now properly track:

-   **Total**: All lending records
-   **On time**: Books returned with `returned` status
-   **Late**: Books returned with `returned_late` status
