create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create table public.ads (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null default '',
  category text not null,
  price numeric(12,2) not null check (price >= 0),
  city text not null,
  status text not null default 'active' check (status in ('active', 'sold', 'archived')),
  created_at timestamptz not null default now()
);

create table public.ad_images (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  storage_path text not null,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  ad_id uuid not null references public.ads(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, ad_id)
);

create table public.chats (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references public.ads(id) on delete set null,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (ad_id, buyer_id, seller_id),
  check (buyer_id <> seller_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index ads_active_created_idx on public.ads(status, created_at desc);
create index ads_seller_idx on public.ads(seller_id);
create index messages_chat_created_idx on public.messages(chat_id, created_at);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ads enable row level security;
alter table public.ad_images enable row level security;
alter table public.favorites enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;

create policy "profiles are visible" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "active ads are visible" on public.ads for select using (status = 'active' or seller_id = auth.uid());
create policy "sample ads are visible" on public.ads for select using (seller_id is null);
create policy "users create own ads" on public.ads for insert with check (auth.uid() = seller_id);
create policy "users update own ads" on public.ads for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
create policy "users delete own ads" on public.ads for delete using (auth.uid() = seller_id);
create policy "ad images are visible" on public.ad_images for select using (exists (select 1 from public.ads where ads.id = ad_images.ad_id and (ads.status = 'active' or ads.seller_id = auth.uid())));
create policy "sellers manage ad images" on public.ad_images for all using (exists (select 1 from public.ads where ads.id = ad_images.ad_id and ads.seller_id = auth.uid())) with check (exists (select 1 from public.ads where ads.id = ad_images.ad_id and ads.seller_id = auth.uid()));
create policy "users manage own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "participants read chats" on public.chats for select using (auth.uid() in (buyer_id, seller_id));
create policy "buyers create chats" on public.chats for insert with check (auth.uid() = buyer_id);
create policy "participants read messages" on public.messages for select using (exists (select 1 from public.chats where chats.id = messages.chat_id and auth.uid() in (buyer_id, seller_id)));
create policy "participants send messages" on public.messages for insert with check (auth.uid() = sender_id and exists (select 1 from public.chats where chats.id = messages.chat_id and auth.uid() in (buyer_id, seller_id)));
create policy "recipients update messages" on public.messages for update using (exists (select 1 from public.chats where chats.id = messages.chat_id and auth.uid() in (buyer_id, seller_id)));

insert into storage.buckets (id, name, public) values ('ad-images', 'ad-images', true) on conflict (id) do nothing;
create policy "public can view ad images" on storage.objects for select using (bucket_id = 'ad-images');
create policy "users upload their ad images" on storage.objects for insert with check (bucket_id = 'ad-images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "users update their ad images" on storage.objects for update using (bucket_id = 'ad-images' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "users delete their ad images" on storage.objects for delete using (bucket_id = 'ad-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Demo ads intentionally use a null seller_id so the app works before test users are created.
insert into public.ads (title, description, category, price, city) values
  ('iPhone 14 · 128 GB', 'Excellent condition, battery health 90%.', 'Mobiles', 41500, 'Bengaluru'),
  ('Royal Enfield Classic 350', 'Single owner, serviced regularly.', 'Bikes', 148000, 'Bengaluru'),
  ('Solid wood study table', 'Minimal wear; pickup only.', 'Furniture', 4200, 'Bengaluru'),
  ('Nike Air Max · UK 8', 'Barely worn, original box included.', 'Fashion', 3800, 'Bengaluru'),
  ('MacBook Air M1', '8GB / 256GB, charger included.', 'Electronics', 52000, 'Mumbai'),
  ('Honda City 2018', 'Petrol automatic, 48,000 km.', 'Cars', 725000, 'Pune'),
  ('IKEA 3-seater sofa', 'Grey fabric sofa in great condition.', 'Furniture', 11500, 'Delhi'),
  ('Sony PS5 Slim', 'Two controllers with three games.', 'Electronics', 43000, 'Hyderabad'),
  ('Samsung 55 inch TV', '4K smart TV with wall mount.', 'Electronics', 27500, 'Chennai'),
  ('Yamaha FZ-S V3', 'Well maintained, 12k km.', 'Bikes', 98000, 'Kochi'),
  ('2 BHK for rent', 'Near metro, family preferred.', 'Properties', 26000, 'Bengaluru'),
  ('Canon EOS 200D', 'Camera body with kit lens.', 'Electronics', 29500, 'Kolkata'),
  ('Dining table set', 'Six chairs, teak finish.', 'Furniture', 18500, 'Ahmedabad'),
  ('Apple Watch SE', '44mm GPS, midnight colour.', 'Mobiles', 16500, 'Noida'),
  ('Mountain bike', '21 speed hybrid bicycle.', 'Bikes', 7800, 'Jaipur'),
  ('Office chair', 'Ergonomic mesh back chair.', 'Furniture', 3500, 'Gurugram'),
  ('AirPods Pro 2', 'Sealed pack with bill.', 'Mobiles', 18500, 'Mumbai'),
  ('Washing machine', '7kg front load, working perfectly.', 'Appliances', 12000, 'Bengaluru'),
  ('Guitar with bag', 'Acoustic guitar for beginners.', 'Hobbies', 4500, 'Pune'),
  ('Kindle Paperwhite', '11th gen, 16GB model.', 'Electronics', 9900, 'Delhi');
