#!/bin/bash
# 接続テスト用スクリプト

echo "Testing connection 1: Pooler"
psql "postgresql://postgres.vzkavfyxjwzifwsbghru:myzvaj-7rabFa-sinjop@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require" -c "SELECT 1;" 2>&1 | head -5

echo ""
echo "Testing connection 2: Direct"
psql "postgresql://postgres:myzvaj-7rabFa-sinjop@db.vzkavfyxjwzifwsbghru.supabase.co:5432/postgres?sslmode=require" -c "SELECT 1;" 2>&1 | head -5
