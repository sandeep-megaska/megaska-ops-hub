-- =====================================================
-- 0001_ops_requests.sql
-- Megaska Ops Hub
-- Core table for Ops Inbox requests
-- =====================================================

create extension if not exists "pgcrypto";

create table if not exists public.ops_requests (
    id uuid primary key default gen_random_uuid(),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    shop_domain text not null,

    request_no text null,

    request_type text not null check (
        request_type in ('EXCHANGE','DEFECT','RETURN','CANCEL','REFUND')
    ),

    status text not null default 'NEW' check (
        status in ('NEW','IN_PROGRESS','DONE','REJECTED')
    ),

    order_id text,
    order_name text,

    customer_name text,
    customer_email text,
    customer_phone text,

    reason text,

    payload jsonb not null default '{}'::jsonb
);


-- =====================================================
-- indexes
-- =====================================================

create index if not exists ops_requests_shop_created_idx
on public.ops_requests (shop_domain, created_at desc);

create index if not exists ops_requests_status_idx
on public.ops_requests (status);

create index if not exists ops_requests_type_idx
on public.ops_requests (request_type);



-- =====================================================
-- updated_at auto trigger
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ops_requests_updated_at
on public.ops_requests;

create trigger trg_ops_requests_updated_at
before update on public.ops_requests
for each row
execute function public.set_updated_at();