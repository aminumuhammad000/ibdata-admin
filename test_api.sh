#!/bin/bash

# API Testing Script using cURL
# This script tests all VTU Admin API endpoints

# Configuration
BASE_URL="http://localhost:5000/api/v1/admin"
TEST_EMAIL="admin@example.com"
TEST_PASSWORD="password"
OUTPUT_FILE="api_test_results.log"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clear previous results
> "$OUTPUT_FILE"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}VTU Admin API Testing Script${NC}"
echo -e "${BLUE}Base URL: $BASE_URL${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to log results
log_result() {
  local endpoint=$1
  local method=$2
  local status=$3
  local response=$4
  
  echo "[$method] $endpoint - Status: $status" | tee -a "$OUTPUT_FILE"
  echo "Response: $response" | tee -a "$OUTPUT_FILE"
  echo "" | tee -a "$OUTPUT_FILE"
}

# 1. Test Login
echo -e "${YELLOW}1️⃣ Testing POST /login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\n%{http_code}")

LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$LOGIN_STATUS" == "200" ]; then
  echo -e "${GREEN}✅ Login successful (Status: $LOGIN_STATUS)${NC}"
  log_result "/login" "POST" "$LOGIN_STATUS" "$LOGIN_BODY"
  
  # Extract token
  TOKEN=$(echo "$LOGIN_BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}📌 Token extracted: ${TOKEN:0:50}...${NC}"
  echo ""
else
  echo -e "${RED}❌ Login failed (Status: $LOGIN_STATUS)${NC}"
  log_result "/login" "POST" "$LOGIN_STATUS" "$LOGIN_BODY"
  echo -e "${RED}Cannot continue without valid token${NC}"
  exit 1
fi

echo ""

# 2. Test Dashboard
echo -e "${YELLOW}2️⃣ Testing GET /dashboard${NC}"
DASHBOARD_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}")

DASHBOARD_STATUS=$(echo "$DASHBOARD_RESPONSE" | tail -n1)
DASHBOARD_BODY=$(echo "$DASHBOARD_RESPONSE" | head -n-1)

if [ "$DASHBOARD_STATUS" == "200" ]; then
  echo -e "${GREEN}✅ Dashboard stats retrieved (Status: $DASHBOARD_STATUS)${NC}"
  log_result "/dashboard" "GET" "$DASHBOARD_STATUS" "$DASHBOARD_BODY"
else
  echo -e "${RED}❌ Dashboard stats failed (Status: $DASHBOARD_STATUS)${NC}"
  log_result "/dashboard" "GET" "$DASHBOARD_STATUS" "$DASHBOARD_BODY"
fi

echo ""

# 3. Test Get Users (paginated)
echo -e "${YELLOW}3️⃣ Testing GET /users (page=1, limit=10)${NC}"
USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}")

USERS_STATUS=$(echo "$USERS_RESPONSE" | tail -n1)
USERS_BODY=$(echo "$USERS_RESPONSE" | head -n-1)

if [ "$USERS_STATUS" == "200" ]; then
  echo -e "${GREEN}✅ Users retrieved (Status: $USERS_STATUS)${NC}"
  log_result "/users?page=1&limit=10" "GET" "$USERS_STATUS" "$USERS_BODY"
  
  # Extract first user ID
  USER_ID=$(echo "$USERS_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  if [ -z "$USER_ID" ]; then
    USER_ID=$(echo "$USERS_BODY" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
  fi
  
  if [ ! -z "$USER_ID" ]; then
    echo -e "${GREEN}📌 First user ID: $USER_ID${NC}"
  else
    echo -e "${YELLOW}⚠️ No users found in response${NC}"
  fi
else
  echo -e "${RED}❌ Get users failed (Status: $USERS_STATUS)${NC}"
  log_result "/users" "GET" "$USERS_STATUS" "$USERS_BODY"
fi

echo ""

# 4. Test Get Single User (if user ID was found)
if [ ! -z "$USER_ID" ]; then
  echo -e "${YELLOW}4️⃣ Testing GET /users/:id${NC}"
  SINGLE_USER_RESPONSE=$(curl -s -X GET "$BASE_URL/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}")

  SINGLE_USER_STATUS=$(echo "$SINGLE_USER_RESPONSE" | tail -n1)
  SINGLE_USER_BODY=$(echo "$SINGLE_USER_RESPONSE" | head -n-1)

  if [ "$SINGLE_USER_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ User details retrieved (Status: $SINGLE_USER_STATUS)${NC}"
    log_result "/users/$USER_ID" "GET" "$SINGLE_USER_STATUS" "$SINGLE_USER_BODY"
  else
    echo -e "${RED}❌ Get user details failed (Status: $SINGLE_USER_STATUS)${NC}"
    log_result "/users/$USER_ID" "GET" "$SINGLE_USER_STATUS" "$SINGLE_USER_BODY"
  fi

  echo ""

  # 5. Test Update User Status
  echo -e "${YELLOW}5️⃣ Testing PUT /users/:id/status${NC}"
  STATUS_UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/users/$USER_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"status\":\"active\"}" \
    -w "\n%{http_code}")

  STATUS_UPDATE_STATUS=$(echo "$STATUS_UPDATE_RESPONSE" | tail -n1)
  STATUS_UPDATE_BODY=$(echo "$STATUS_UPDATE_RESPONSE" | head -n-1)

  if [ "$STATUS_UPDATE_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ User status updated (Status: $STATUS_UPDATE_STATUS)${NC}"
    log_result "/users/$USER_ID/status" "PUT" "$STATUS_UPDATE_STATUS" "$STATUS_UPDATE_BODY"
  else
    echo -e "${RED}❌ Update user status failed (Status: $STATUS_UPDATE_STATUS)${NC}"
    log_result "/users/$USER_ID/status" "PUT" "$STATUS_UPDATE_STATUS" "$STATUS_UPDATE_BODY"
  fi

  echo ""

  # 6. Test Update User Details
  echo -e "${YELLOW}6️⃣ Testing PUT /users/:id${NC}"
  USER_UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"first_name\":\"UpdatedName\",\"last_name\":\"TestUser\"}" \
    -w "\n%{http_code}")

  USER_UPDATE_STATUS=$(echo "$USER_UPDATE_RESPONSE" | tail -n1)
  USER_UPDATE_BODY=$(echo "$USER_UPDATE_RESPONSE" | head -n-1)

  if [ "$USER_UPDATE_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ User details updated (Status: $USER_UPDATE_STATUS)${NC}"
    log_result "/users/$USER_ID" "PUT" "$USER_UPDATE_STATUS" "$USER_UPDATE_BODY"
  else
    echo -e "${RED}❌ Update user details failed (Status: $USER_UPDATE_STATUS)${NC}"
    log_result "/users/$USER_ID" "PUT" "$USER_UPDATE_STATUS" "$USER_UPDATE_BODY"
  fi

  echo ""
else
  echo -e "${YELLOW}⚠️ Skipping individual user tests (no user ID found)${NC}"
  echo ""
fi

# 7. Test Get Audit Logs (paginated)
echo -e "${YELLOW}7️⃣ Testing GET /audit-logs (page=1, limit=10)${NC}"
AUDIT_LOGS_RESPONSE=$(curl -s -X GET "$BASE_URL/audit-logs?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}")

AUDIT_LOGS_STATUS=$(echo "$AUDIT_LOGS_RESPONSE" | tail -n1)
AUDIT_LOGS_BODY=$(echo "$AUDIT_LOGS_RESPONSE" | head -n-1)

if [ "$AUDIT_LOGS_STATUS" == "200" ]; then
  echo -e "${GREEN}✅ Audit logs retrieved (Status: $AUDIT_LOGS_STATUS)${NC}"
  log_result "/audit-logs?page=1&limit=10" "GET" "$AUDIT_LOGS_STATUS" "$AUDIT_LOGS_BODY"
  
  # Extract first log ID
  LOG_ID=$(echo "$AUDIT_LOGS_BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  if [ -z "$LOG_ID" ]; then
    LOG_ID=$(echo "$AUDIT_LOGS_BODY" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
  fi
  
  if [ ! -z "$LOG_ID" ]; then
    echo -e "${GREEN}📌 First log ID: $LOG_ID${NC}"
  else
    echo -e "${YELLOW}⚠️ No audit logs found in response${NC}"
  fi
else
  echo -e "${RED}❌ Get audit logs failed (Status: $AUDIT_LOGS_STATUS)${NC}"
  log_result "/audit-logs" "GET" "$AUDIT_LOGS_STATUS" "$AUDIT_LOGS_BODY"
fi

echo ""

# 8. Test Delete Audit Log (if log ID was found)
if [ ! -z "$LOG_ID" ]; then
  echo -e "${YELLOW}8️⃣ Testing DELETE /audit-logs/:id${NC}"
  DELETE_LOG_RESPONSE=$(curl -s -X DELETE "$BASE_URL/audit-logs/$LOG_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}")

  DELETE_LOG_STATUS=$(echo "$DELETE_LOG_RESPONSE" | tail -n1)
  DELETE_LOG_BODY=$(echo "$DELETE_LOG_RESPONSE" | head -n-1)

  if [ "$DELETE_LOG_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Audit log deleted (Status: $DELETE_LOG_STATUS)${NC}"
    log_result "/audit-logs/$LOG_ID" "DELETE" "$DELETE_LOG_STATUS" "$DELETE_LOG_BODY"
  else
    echo -e "${RED}❌ Delete audit log failed (Status: $DELETE_LOG_STATUS)${NC}"
    log_result "/audit-logs/$LOG_ID" "DELETE" "$DELETE_LOG_STATUS" "$DELETE_LOG_BODY"
  fi

  echo ""
else
  echo -e "${YELLOW}⚠️ Skipping delete audit log test (no log ID found)${NC}"
  echo ""
fi

# Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}Testing Complete!${NC}"
echo -e "${BLUE}Results saved to: $OUTPUT_FILE${NC}"
echo -e "${BLUE}================================================${NC}"
