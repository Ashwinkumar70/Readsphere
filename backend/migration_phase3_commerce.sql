-- ============================================================
-- ReadSphere Phase 3 Commerce & Analytics Schema
-- ============================================================

-- 1. shipping_addresses
CREATE TABLE IF NOT EXISTS shipping_addresses (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city          TEXT NOT NULL,
    state         TEXT NOT NULL,
    postal_code   TEXT NOT NULL,
    country       TEXT NOT NULL,
    is_default    BOOLEAN DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_shipping_addresses_updated_at BEFORE UPDATE ON shipping_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. orders
CREATE TABLE IF NOT EXISTS orders (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded')),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency     TEXT NOT NULL DEFAULT 'USD',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. order_items
CREATE TABLE IF NOT EXISTS order_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal   NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. payments
CREATE TABLE IF NOT EXISTS payments (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount         NUMERIC(10, 2) NOT NULL,
    provider       TEXT NOT NULL DEFAULT 'Stripe',
    status         TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    transaction_id TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. payment_transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id       UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    gateway_response JSONB,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. physical_orders
CREATE TABLE IF NOT EXISTS physical_orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    shipping_address_id UUID NOT NULL REFERENCES shipping_addresses(id) ON DELETE RESTRICT,
    shipping_status     TEXT NOT NULL DEFAULT 'Processing' CHECK (shipping_status IN ('Processing', 'Shipped', 'Delivered', 'Returned')),
    tracking_number     TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_physical_orders_updated_at BEFORE UPDATE ON physical_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own shipping addresses
CREATE POLICY "Users read own shipping_addresses" ON shipping_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own shipping_addresses" ON shipping_addresses FOR ALL USING (auth.uid() = user_id);

-- Users can read their own orders
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own order items, OR Authors can read order items for their books
CREATE POLICY "Users read own order_items" ON order_items FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM orders WHERE id = order_items.order_id)
);
CREATE POLICY "Authors read own book order_items" ON order_items FOR SELECT USING (
  auth.uid() IN (SELECT author_id FROM books WHERE id = order_items.book_id)
);

-- Users can read their own payments
CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Authors can read payments for their orders? No, authors only need aggregated item sales.
-- Admins/System handles inserts (omitted for brevity, handled by service role in real app).

-- Physical orders
CREATE POLICY "Users read own physical_orders" ON physical_orders FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM orders WHERE id = physical_orders.order_id)
);
