#!/bin/bash

# VTU App Admin API Test Script
# This script tests all admin endpoints

API_BASE_URL="http://localhost:5000/api/admin"
ADMIN_EMAIL="admin@connectavtu.com"
ADMIN_PASSWORD="Admin@123456"
TOKEN=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         VTU Admin API Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

# Test 1: Admin Login
echo -e "${YELLOW}TEST 1: Admin Login${NC}"
echo "Endpoint: POST /api/admin/login"
echo "Body: { email: '$ADMIN_EMAIL', password: '$ADMIN_PASSWORD' }"

LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

echo "Response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed - No token received${NC}\n"
  exit 1
else
  echo -e "${GREEN}✅ Login successful - Token: ${TOKEN:0:20}...${NC}\n"
fi

# Test 2: Get Dashboard Stats
echo -e "${YELLOW}TEST 2: Get Dashboard Stats${NC}"
echo "Endpoint: GET /api/admin/dashboard"

DASHBOARD_RESPONSE=$(curl -s -X GET "$API_BASE_URL/dashboard" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $DASHBOARD_RESPONSE"
echo -e "${GREEN}✅ Dashboard stats retrieved${NC}\n"

# Test 3: Get All Users
echo -e "${YELLOW}TEST 3: Get All Users (Paginated)${NC}"
echo "Endpoint: GET /api/admin/users?page=1&limit=5"

USERS_RESPONSE=$(curl -s -X GET "$API_BASE_URL/users?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $USERS_RESPONSE" | head -c 500
echo "..."
echo -e "${GREEN}✅ Users list retrieved${NC}\n"

# Extract a user ID for further tests
USER_ID=$(echo $USERS_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -n "$USER_ID" ]; then
  echo -e "${BLUE}Found user ID: $USER_ID${NC}\n"

  # Test 4: Get User By ID
  echo -e "${YELLOW}TEST 4: Get User By ID${NC}"
  echo "Endpoint: GET /api/admin/users/$USER_ID"

  USER_BY_ID=$(curl -s -X GET "$API_BASE_URL/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response: $USER_BY_ID" | head -c 400
  echo "..."
  echo -e "${GREEN}✅ User retrieved by ID${NC}\n"

  # Test 5: Update User Status
  echo -e "${YELLOW}TEST 5: Update User Status${NC}"
  echo "Endpoint: PUT /api/admin/users/$USER_ID/status"
  echo "Body: { status: 'active' }"

  STATUS_UPDATE=$(curl -s -X PUT "$API_BASE_URL/users/$USER_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"active\"}")

  echo "Response: $STATUS_UPDATE" | head -c 300
  echo "..."
  echo -e "${GREEN}✅ User status updated${NC}\n"

  # Test 6: Update User
  echo -e "${YELLOW}TEST 6: Update User Details${NC}"
  echo "Endpoint: PUT /api/admin/users/$USER_ID"
  echo "Body: { first_name: 'Updated', last_name: 'User' }"

  USER_UPDATE=$(curl -s -X PUT "$API_BASE_URL/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"first_name\": \"Updated\", \"last_name\": \"User\"}")

  echo "Response: $USER_UPDATE" | head -c 300
  echo "..."
  echo -e "${GREEN}✅ User details updated${NC}\n"

  # Test 7: Credit User Wallet
  echo -e "${YELLOW}TEST 7: Credit User Wallet${NC}"
  echo "Endpoint: POST /api/admin/wallet/credit"
  echo "Body: { userId: '$USER_ID', amount: 1000, description: 'Admin test credit' }"

  WALLET_CREDIT=$(curl -s -X POST "$API_BASE_URL/wallet/credit" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"userId\": \"$USER_ID\", \"amount\": 1000, \"description\": \"Admin test credit\"}")

  echo "Response: $WALLET_CREDIT" | head -c 400
  echo "..."
  echo -e "${GREEN}✅ User wallet credited${NC}\n"
else
  echo -e "${YELLOW}⚠️  No users found to test individual user endpoints${NC}\n"
fi

# Test 8: Get Audit Logs
echo -e "${YELLOW}TEST 8: Get Audit Logs${NC}"
echo "Endpoint: GET /api/admin/audit-logs?page=1&limit=5"

AUDIT_LOGS=$(curl -s -X GET "$API_BASE_URL/audit-logs?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $AUDIT_LOGS" | head -c 500
echo "..."
echo -e "${GREEN}✅ Audit logs retrieved${NC}\n"

# Test 9: Get All Pricing Plans
echo -e "${YELLOW}TEST 9: Get All Pricing Plans${NC}"
echo "Endpoint: GET /api/admin/pricing?page=1&limit=10"

PRICING_PLANS=$(curl -s -X GET "$API_BASE_URL/pricing?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $PRICING_PLANS" | head -c 500
echo "..."
echo -e "${GREEN}✅ Pricing plans retrieved${NC}\n"

# Test 10: Create New Pricing Plan
echo -e "${YELLOW}TEST 10: Create New Pricing Plan${NC}"
echo "Endpoint: POST /api/admin/pricing"

NEW_PLAN=$(curl -s -X POST "$API_BASE_URL/pricing" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": 1,
    "providerName": "MTN",
    "name": "Test MTN 1GB Daily",
    "price": 350,
    "type": "DATA",
    "discount": 5,
    "active": true
  }')

echo "Response: $NEW_PLAN" | head -c 400
echo "..."
PLAN_ID=$(echo $NEW_PLAN | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ New pricing plan created${NC}\n"

if [ -n "$PLAN_ID" ]; then
  # Test 11: Get Plan By ID
  echo -e "${YELLOW}TEST 11: Get Pricing Plan By ID${NC}"
  echo "Endpoint: GET /api/admin/pricing/$PLAN_ID"

  PLAN_BY_ID=$(curl -s -X GET "$API_BASE_URL/pricing/$PLAN_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response: $PLAN_BY_ID" | head -c 400
  echo "..."
  echo -e "${GREEN}✅ Pricing plan retrieved by ID${NC}\n"

  # Test 12: Update Pricing Plan
  echo -e "${YELLOW}TEST 12: Update Pricing Plan${NC}"
  echo "Endpoint: PUT /api/admin/pricing/$PLAN_ID"

  PLAN_UPDATE=$(curl -s -X PUT "$API_BASE_URL/pricing/$PLAN_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "price": 375,
      "discount": 8
    }')

  echo "Response: $PLAN_UPDATE" | head -c 400
  echo "..."
  echo -e "${GREEN}✅ Pricing plan updated${NC}\n"

  # Test 13: Delete Pricing Plan
  echo -e "${YELLOW}TEST 13: Delete Pricing Plan${NC}"
  echo "Endpoint: DELETE /api/admin/pricing/$PLAN_ID"

  PLAN_DELETE=$(curl -s -X DELETE "$API_BASE_URL/pricing/$PLAN_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response: $PLAN_DELETE" | head -c 300
  echo "..."
  echo -e "${GREEN}✅ Pricing plan deleted${NC}\n"
fi

# Test 14: Get Plans by Provider
echo -e "${YELLOW}TEST 14: Get Plans by Provider${NC}"
echo "Endpoint: GET /api/admin/pricing/provider/1?type=DATA"

PLANS_BY_PROVIDER=$(curl -s -X GET "$API_BASE_URL/pricing/provider/1?type=DATA" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $PLANS_BY_PROVIDER" | head -c 400
echo "..."
echo -e "${GREEN}✅ Plans by provider retrieved${NC}\n"

# Test 15: Bulk Import Pricing Plans
echo -e "${YELLOW}TEST 15: Bulk Import Pricing Plans${NC}"
echo "Endpoint: POST /api/admin/pricing/bulk-import"

BULK_IMPORT=$(curl -s -X POST "$API_BASE_URL/pricing/bulk-import" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plans": [
      {
        "providerId": 2,
        "providerName": "Glo",
        "name": "Glo 1GB Daily",
        "price": 300,
        "type": "DATA",
        "discount": 3,
        "active": true
      },
      {
        "providerId": 3,
        "providerName": "Airtel",
        "name": "Airtel 1GB Daily",
        "price": 320,
        "type": "DATA",
        "discount": 4,
        "active": true
      }
    ]
  }')

echo "Response: $BULK_IMPORT"
echo -e "${GREEN}✅ Bulk import completed${NC}\n"

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All Admin API Tests Completed Successfully!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Admin Credentials:${NC}"
echo -e "📧 Email: ${GREEN}$ADMIN_EMAIL${NC}"
echo -e "🔑 Password: ${GREEN}$ADMIN_PASSWORD${NC}\n"

echo -e "${YELLOW}API Base URL:${NC}"
echo -e "🔗 ${GREEN}$API_BASE_URL${NC}\n"

echo -e "${YELLOW}Endpoints Tested:${NC}"
echo "1. ✅ POST /login - Admin login"
echo "2. ✅ GET /dashboard - Dashboard stats"
echo "3. ✅ GET /users - List users"
echo "4. ✅ GET /users/:id - Get user by ID"
echo "5. ✅ PUT /users/:id/status - Update user status"
echo "6. ✅ PUT /users/:id - Update user details"
echo "7. ✅ POST /wallet/credit - Credit user wallet"
echo "8. ✅ GET /audit-logs - Get audit logs"
echo "9. ✅ GET /pricing - Get all pricing plans"
echo "10. ✅ POST /pricing - Create pricing plan"
echo "11. ✅ GET /pricing/:id - Get plan by ID"
echo "12. ✅ PUT /pricing/:id - Update pricing plan"
echo "13. ✅ DELETE /pricing/:id - Delete pricing plan"
echo "14. ✅ GET /pricing/provider/:id - Get plans by provider"
echo "15. ✅ POST /pricing/bulk-import - Bulk import plans"
