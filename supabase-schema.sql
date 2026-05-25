create extension if not exists "uuid-ossp";

create table farms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  name text not null,
  emoji text not null default '📦',
  price numeric(10,2) not null default 0,
  unit text not null default 'each',
  initial_stock integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table inventory (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(farm_id, product_id)
);

create table sales (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  total numeric(10,2) not null default 0,
  sold_at timestamptz not null default now()
);

create table sale_items (
  id uuid primary key default uuid_generate_v4(),
  sale_id uuid not null references sales(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null,
  price_at_time numeric(10,2) not null
);

alter table farms enable row level security;
alter table products enable row level security;
alter table inventory enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;

create policy "farm members see their farm"
  on farms for all
  using (owner_id = auth.uid());

create policy "farm members see their products"
  on products for all
  using (farm_id in (select id from farms where owner_id = auth.uid()));

create policy "farm members see their inventory"
  on inventory for all
  using (farm_id in (select id from farms where owner_id = auth.uid()));

create policy "farm members see their sales"
  on sales for all
  using (farm_id in (select id from farms where owner_id = auth.uid()));

create policy "farm members see their sale items"
  on sale_items for all
  using (sale_id in (select id from sales where farm_id in (select id from farms where owner_id = auth.uid())));

create or replace function update_inventory_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger inventory_updated_at
  before update on inventory
  for each row execute function update_inventory_timestamp();