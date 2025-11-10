# Complete API Endpoint Reference

## Base URL
```
http://localhost:5000/api/v1/admin
```

---

## Authentication Endpoints

### 1. Login
**Method:** `POST`  
**Endpoint:** `/login`  
**Authentication:** ❌ Not required

**Request:**
```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Dashboard Endpoints

### 2. Get Dashboard Statistics
**Method:** `GET`  
**Endpoint:** `/dashboard`  
**Authentication:** ✅ Required (Bearer Token)

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 120,
    "totalTransactions": 5000,
    "successfulTransactions": 4500,
    "totalRevenue": 2500000,
    "pendingTransactions": 300
  },
  "message": "Dashboard stats retrieved successfully"
}
```

---

## User Management Endpoints

### 3. Get All Users (Paginated)
**Method:** `GET`  
**Endpoint:** `/users`  
**Authentication:** ✅ Required  
**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "user1@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "08012345678",
      "status": "active",
      "kyc_status": "verified",
      "created_at": "2023-10-15T10:30:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "email": "user2@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "phone_number": "08087654321",
      "status": "active",
      "kyc_status": "pending",
      "created_at": "2023-10-16T11:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  },
  "message": "Users retrieved successfully"
}
```

---

### 4. Get Single User Details
**Method:** `GET`  
**Endpoint:** `/users/:id`  
**Authentication:** ✅ Required  
**Path Parameters:**
- `id` (required) - User ID

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "08012345678",
    "status": "active",
    "kyc_status": "verified",
    "wallet_balance": 50000,
    "created_at": "2023-10-15T10:30:00Z",
    "updated_at": "2023-10-20T15:45:00Z"
  },
  "message": "User retrieved successfully"
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 5. Update User Details
**Method:** `PUT`  
**Endpoint:** `/users/:id`  
**Authentication:** ✅ Required  
**Path Parameters:**
- `id` (required) - User ID

**Request:**
```bash
curl -X PUT http://localhost:5000/api/v1/admin/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone_number": "08012345678",
    "status": "active",
    "kyc_status": "verified"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "08012345678",
    "status": "active",
    "kyc_status": "verified",
    "updated_at": "2023-10-20T16:00:00Z"
  },
  "message": "User updated successfully"
}
```

---

### 6. Update User Status
**Method:** `PUT`  
**Endpoint:** `/users/:id/status`  
**Authentication:** ✅ Required  
**Path Parameters:**
- `id` (required) - User ID

**Request:**
```bash
curl -X PUT http://localhost:5000/api/v1/admin/users/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "active"}'
```

**Valid Status Values:**
- `active`
- `inactive`
- `suspended`
- `banned`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "status": "active",
    "updated_at": "2023-10-20T16:05:00Z"
  },
  "message": "User status updated successfully"
}
```

---

### 7. Delete User
**Method:** `DELETE`  
**Endpoint:** `/users/:id`  
**Authentication:** ✅ Required  
**Path Parameters:**
- `id` (required) - User ID

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/v1/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "User deleted successfully"
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Audit Log Endpoints

### 8. Get Audit Logs (Paginated)
**Method:** `GET`  
**Endpoint:** `/audit-logs`  
**Authentication:** ✅ Required  
**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/admin/audit-logs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "607f1f77bcf86cd799439021",
      "admin_id": "507f1f77bcf86cd799439011",
      "action": "USER_UPDATED",
      "resource_type": "user",
      "resource_id": "507f1f77bcf86cd799439012",
      "changes": {
        "status": ["active", "inactive"]
      },
      "timestamp": "2023-10-20T15:00:00Z"
    },
    {
      "id": "607f1f77bcf86cd799439022",
      "admin_id": "507f1f77bcf86cd799439011",
      "action": "USER_DELETED",
      "resource_type": "user",
      "resource_id": "507f1f77bcf86cd799439013",
      "timestamp": "2023-10-20T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "pages": 25
  },
  "message": "Audit logs retrieved successfully"
}
```

---

### 9. Delete Audit Log
**Method:** `DELETE`  
**Endpoint:** `/audit-logs/:id`  
**Authentication:** ✅ Required  
**Path Parameters:**
- `id` (required) - Audit Log ID

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/v1/admin/audit-logs/607f1f77bcf86cd799439021 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Audit log deleted successfully"
}
```

---

## Common HTTP Status Codes

| Code | Meaning | Typical Cause |
|------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation error |
| 500 | Server Error | Backend error |

---

## Authentication Header Format

All endpoints except `/login` require the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```bash
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
```

---

## Testing All Endpoints

### Using the provided test script:
```bash
bash test_api.sh
```

### Using manual curl:
See `QUICK_API_TEST.md` for step-by-step commands

### Using browser console:
1. Run: `npm run dev`
2. Open: `http://localhost:5173/`
3. Press: `F12` (Developer Console)
4. Type: `testAllEndpoints()`
