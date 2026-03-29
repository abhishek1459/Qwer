import { useEffect, useMemo, useState } from "react";
import { cn } from "./utils/cn";

// Types
type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  compareAt?: number;
  category: string;
  image: string;
  color: string;
  material: string;
  rating: number;
  reviews: number;
  badges?: string[];
};

type CartItem = {
  product: Product;
  qty: number;
};

type AddressForm = {
  name: string;
  mobile: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type PaymentMethod = "cod" | "card" | "upi";

type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  address: AddressForm;
  payment: PaymentMethod;
  status: "pending" | "confirmed" | "shipped" | "delivered";
};

// Mock data
const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Lumen Desk Lamp",
    brand: "Nimbus",
    price: 129,
    compareAt: 159,
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop",
    color: "Matte Black",
    material: "Aluminum",
    rating: 4.7,
    reviews: 212,
    badges: ["Best Seller"],
  },
  {
    id: "p2",
    title: "Moss Wool Throw",
    brand: "Aarde",
    price: 89,
    category: "Textiles",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200&auto=format&fit=crop",
    color: "Sage",
    material: "Merino Wool",
    rating: 4.5,
    reviews: 84,
  },
  {
    id: "p3",
    title: "Kumo Ceramic Mug Set",
    brand: "Toku",
    price: 42,
    compareAt: 55,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1200&auto=format&fit=crop",
    color: "Oat",
    material: "Stoneware",
    rating: 4.8,
    reviews: 432,
    badges: ["Limited"],
  },
  {
    id: "p4",
    title: "Haven Linen Cushion",
    brand: "Aarde",
    price: 64,
    category: "Textiles",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop",
    color: "Drift",
    material: "European Linen",
    rating: 4.4,
    reviews: 151,
  },
  {
    id: "p5",
    title: "Sora Water Bottle",
    brand: "Nimbus",
    price: 38,
    category: "Everyday",
    image:
      "https://images.unsplash.com/photo-1526401485004-2aa6b3a590c9?q=80&w=1200&auto=format&fit=crop",
    color: "Stone",
    material: "Stainless Steel",
    rating: 4.6,
    reviews: 298,
  },
  {
    id: "p6",
    title: "Miro Walnut Tray",
    brand: "Toku",
    price: 76,
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    color: "Walnut",
    material: "Solid Walnut",
    rating: 4.9,
    reviews: 57,
    badges: ["Handcrafted"],
  },
  {
    id: "p7",
    title: "Aura Diffuser",
    brand: "Nimbus",
    price: 98,
    compareAt: 120,
    category: "Wellness",
    image:
      "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1200&auto=format&fit=crop",
    color: "Sand",
    material: "Porcelain + Wood",
    rating: 4.3,
    reviews: 103,
  },
  {
    id: "p8",
    title: "Rivulet Cutting Board",
    brand: "Toku",
    price: 54,
    category: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=1200&auto=format&fit=crop",
    color: "Acacia",
    material: "Acacia Wood",
    rating: 4.6,
    reviews: 189,
  },
];

const CATEGORIES = ["All", "Lighting", "Textiles", "Kitchen", "Home", "Everyday", "Wellness"];

// Helpers
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});



function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Icons (inline, no deps)
function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function IconTruck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 7h13v8a2 2 0 0 1-2 2h-1" />
      <path d="M14 11h5l3 3v3a2 2 0 0 1-2 2h-1.5" />
      <circle cx="7.5" cy="19" r="2" />
      <circle cx="17.5" cy="19" r="2" />
    </svg>
  );
}
function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Z" />
    </svg>
  );
}
function IconSpark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v8" />
      <path d="m19 7-5 3 5 3" />
      <path d="m5 7 5 3-5 3" />
      <path d="M12 14v8" />
    </svg>
  );
}

export default function App() {
  // UI state
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("nimbus_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("nimbus_cart", JSON.stringify(cart));
  }, [cart]);

  // Checkout form
  const [address, setAddress] = useState<AddressForm>({
    name: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [promoCode, setPromoCode] = useState("");
  const [applyPromoMsg, setApplyPromoMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});

  // Derived lists
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured: keep original order + badges first
        list.sort((a, b) => (b.badges ? 1 : 0) - (a.badges ? 1 : 0));
        break;
    }
    return list;
  }, [category, query, sort]);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 0 ? (subtotal > 150 ? 0 : 8) : 0;
  const tax = Math.round(subtotal * 0.08);
  const discount = promoCode.toUpperCase() === "NIMBUS10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shipping + tax - discount);

  // Actions
  function addToCart(product: Product, qty = 1) {
    setCart((c) => {
      const idx = c.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...c];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...c, { product, qty }];
    });
    setCartOpen(true);
  }
  function changeQty(id: string, delta: number) {
    setCart((c) =>
      c
        .map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  }
  function removeItem(id: string) {
    setCart((c) => c.filter((i) => i.product.id !== id));
  }
  function clearCart() {
    setCart([]);
  }

  // Validation
  function validateAddress(a: AddressForm) {
    const e: Partial<Record<keyof AddressForm, string>> = {};
    if (!a.name.trim()) e.name = "Full name is required";
    if (!a.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!/^\+?[0-9 ()-]{7,}$/.test(a.mobile)) e.mobile = "Enter a valid mobile number";
    if (!a.address1.trim()) e.address1 = "Address line 1 is required";
    if (!a.city.trim()) e.city = "City is required";
    if (!a.state.trim()) e.state = "State/Province is required";
    if (!a.zip.trim()) e.zip = "ZIP / Postal code is required";
    if (a.email && !/^\S+@\S+\.\S+$/.test(a.email)) e.email = "Enter a valid email";
    return e;
  }

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    if (code === "NIMBUS10") {
      setApplyPromoMsg("Promo applied: 10% off");
    } else if (!code) {
      setApplyPromoMsg(null);
    } else {
      setApplyPromoMsg("Invalid code. Try NIMBUS10");
    }
  }

  function placeOrder() {
    const e = validateAddress(address);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const order: Order = {
      id: "NM-" + genId().slice(0, 6).toUpperCase(),
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      address,
      payment,
      status: "confirmed",
    };
    setOrderPlaced(order);
    clearCart();
    setCheckoutOpen(false);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#e8eefc_0%,transparent_50%),radial-gradient(900px_500px_at_110%_0%,#f6f0ff_0%,transparent_50%),linear-gradient(#fafafb,#f5f5f7)] text-zinc-900 antialiased">
      {/* Announcement */}
      <div className="w-full border-b border-zinc-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-zinc-600 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-5 items-center rounded-full bg-zinc-900 px-2 text-[10px] font-semibold uppercase tracking-widest text-white">New</span>
            Free shipping over $150 • 30-day returns
          </span>
          <span className="hidden sm:inline">Need help? support@nimbus.example</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200">
              <IconSpark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Nimbus Market</div>
              <div className="-mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">crafted essentials</div>
            </div>
          </div>

          {/* Search */}
          <div className="mx-4 hidden flex-1 items-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm sm:flex">
            <IconSearch className="mr-2 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, materials, brands…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <div className="ml-2 hidden items-center gap-1 text-[10px] text-zinc-400 sm:flex">
              <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5">⌘K</kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:shadow"
            >
              <IconBag className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-zinc-900 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="border-t border-zinc-200/70">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-2 py-2 sm:px-6 lg:px-8">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition",
                  category === c
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                )}
              >
                {c}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 pr-2 text-sm">
              <label className="text-zinc-500">Sort</label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="appearance-none rounded-xl border border-zinc-200 bg-white py-1.5 pl-3 pr-8 text-sm outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="rating">Rating</option>
                </select>
                <IconChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Order confirmation banner */}
      {orderPlaced && (
        <div className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold">Order confirmed — {orderPlaced.id}</div>
                <div className="text-sm text-emerald-900/80">
                  Thanks {orderPlaced.address.name.split(" ")[0]}! We sent a receipt to {orderPlaced.address.email || "your email"}.
                  {orderPlaced.payment === "cod" && " You chose Cash on Delivery."}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-medium text-emerald-900 ring-1 ring-emerald-200">
                  <IconTruck className="h-4 w-4" /> Estimated delivery 3–5 days
                </span>
                <button
                  onClick={() => setOrderPlaced(null)}
                  className="rounded-xl bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 p-[1px] shadow-xl shadow-indigo-200/50">
          <div className="relative grid grid-cols-1 gap-6 rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 text-white backdrop-blur-xl md:grid-cols-5 md:p-10">
            <div className="md:col-span-3">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs tracking-widest uppercase">
                New Season
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Objects that outlive trends</h1>
              <p className="mt-3 max-w-xl text-white/80">
                Curated everyday goods designed with natural materials and honest prices. Free returns and lifetime support.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("catalog");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:shadow"
                >
                  Shop the collection
                </button>
                <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur">
                  <IconShield className="h-4 w-4" /> 2-year warranty
                </div>
              </div>
              <div className="mt-6 grid max-w-md grid-cols-3 gap-3 text-center text-xs text-white/80">
                <div className="rounded-xl bg-white/10 p-3">
                  <div className="text-lg font-semibold">4.8</div>
                  Avg rating
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <div className="text-lg font-semibold">30d</div>
                  Free returns
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <div className="text-lg font-semibold">CO₂</div>
                  Carbon-neutral ship
                </div>
              </div>
            </div>
            <div className="relative md:col-span-2">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=1200&auto=format&fit=crop"
                alt="Still life"
                className="h-full w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Filters mobile */}
        <div className="mb-4 flex items-center gap-2 sm:hidden">
          <div className="flex flex-1 items-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
            <IconSearch className="mr-2 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Catalog */}
        <section id="catalog" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md"
            >
              <div className="relative overflow-hidden rounded-[1.1rem]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  {p.badges?.map((b) => (
                    <span key={b} className="rounded-full bg-zinc-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                      {b}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="absolute bottom-3 right-3 translate-y-2 rounded-xl bg-zinc-900/90 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Add to cart
                </button>
              </div>
              <div className="px-1 pb-1 pt-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium leading-tight">{p.title}</h3>
                    <div className="mt-0.5 text-xs text-zinc-500">
                      {p.brand} • {p.material} • {p.color}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold">{currency.format(p.price)}</div>
                    {p.compareAt && (
                      <div className="text-xs text-zinc-400 line-through">{currency.format(p.compareAt)}</div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-amber-600">
                    <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-amber-100">★</span>
                    <span className="font-medium text-zinc-700">{p.rating.toFixed(1)}</span>
                    <span className="text-zinc-500">({p.reviews})</span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Promo strip */}
        <section className="mt-12 grid gap-4 rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <IconTruck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Fast, tracked shipping</div>
              <div className="text-xs text-zinc-500">Orders ship in 1-2 business days</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <IconShield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">2-year warranty</div>
              <div className="text-xs text-zinc-500">We stand behind our products</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <IconSpark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Designed to last</div>
              <div className="text-xs text-zinc-500">Timeless materials and finishes</div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating cart button (mobile) */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-zinc-900/20 sm:hidden"
      >
        <IconBag className="h-5 w-5" />
        Cart ({cartCount})
      </button>

      {/* Cart drawer */}
      <div className={cn("fixed inset-0 z-50 transition", cartOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          onClick={() => setCartOpen(false)}
          className={cn("absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity", cartOpen ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform",
            cartOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <div className="flex items-center gap-2 text-base font-semibold">
              <IconBag className="h-5 w-5" /> Your Cart
            </div>
            <button onClick={() => setCartOpen(false)} className="rounded-xl p-2 hover:bg-zinc-100">
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="grid h-full place-items-center p-8 text-center">
                <div className="space-y-3">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-zinc-100">
                    <IconBag className="h-7 w-7 text-zinc-500" />
                  </div>
                  <div className="text-base font-semibold">Your cart is empty</div>
                  <div className="text-sm text-zinc-500">
                    Add some beautiful objects and they’ll appear here.
                  </div>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mx-auto mt-2 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200">
                {cart.map((i) => (
                  <li key={i.product.id} className="flex gap-3 p-4">
                    <img src={i.product.image} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-zinc-200" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium leading-tight">{i.product.title}</div>
                          <div className="text-xs text-zinc-500">
                            {i.product.color} • {i.product.material}
                          </div>
                        </div>
                        <button onClick={() => removeItem(i.product.id)} className="rounded lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
                          <IconX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-xl ring-1 ring-zinc-200">
                          <button onClick={() => changeQty(i.product.id, -1)} className="px-2 py-1 text-zinc-600 hover:bg-zinc-100">−</button>
                          <div className="w-8 text-center text-sm font-medium">{i.qty}</div>
                          <button onClick={() => changeQty(i.product.id, 1)} className="px-2 py-1 text-zinc-600 hover:bg-zinc-100">+</button>
                        </div>
                        <div className="text-sm font-semibold">{currency.format(i.product.price * i.qty)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Totals */}
          <div className="border-t border-zinc-200 p-5">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium">{currency.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : currency.format(shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Estimated tax</span>
                <span className="font-medium">{currency.format(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-medium">−{currency.format(discount)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-base">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-semibold">{currency.format(total)}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
                className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                Checkout
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-medium ring-1 ring-zinc-200 hover:bg-zinc-50"
              >
                Continue shopping
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-zinc-500">Taxes calculated at checkout. Free shipping $150+.</p>
          </div>
        </aside>
      </div>

      {/* Checkout modal */}
      <div className={cn("fixed inset-0 z-[60] transition", checkoutOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          onClick={() => setCheckoutOpen(false)}
          className={cn("absolute inset-0 bg-zinc-900/50 backdrop-blur-sm transition-opacity", checkoutOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          className={cn(
            "absolute inset-0 mx-auto my-6 flex w-full max-w-5xl items-stretch overflow-hidden rounded-[1.75rem] bg-white shadow-2xl ring-1 ring-zinc-200 transition",
            checkoutOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {/* Left: form */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
              <div className="text-base font-semibold">Checkout</div>
              <button onClick={() => setCheckoutOpen(false)} className="rounded-xl p-2 hover:bg-zinc-100">
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-0 overflow-y-auto md:grid-cols-5">
              <div className="col-span-3 space-y-6 p-6">
                {/* Shipping address */}
                <section className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-zinc-900 text-white">
                      1
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-600">Shipping details</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name (mandatory for COD) */}
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">
                        Full name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-zinc-400",
                          errors.name ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="Alex Rivera"
                      />
                      {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                    </div>

                    {/* Mobile (mandatory for COD) */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Mobile number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        value={address.mobile}
                        onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400",
                          errors.mobile ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="+1 (555) 123-4567"
                        inputMode="tel"
                      />
                      {errors.mobile && <p className="mt-1 text-xs text-rose-600">{errors.mobile}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Email (receipt)</label>
                      <input
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400",
                          errors.email ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="you@example.com"
                        type="email"
                      />
                      {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                    </div>

                    {/* Address (mandatory for COD) */}
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">
                        Address line 1 <span className="text-rose-600">*</span>
                      </label>
                      <input
                        value={address.address1}
                        onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400",
                          errors.address1 ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="1827 Elm Street, Apt 4B"
                      />
                      {errors.address1 && <p className="mt-1 text-xs text-rose-600">{errors.address1}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Address line 2</label>
                      <input
                        value={address.address2}
                        onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400"
                        placeholder="Building, landmark"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">City <span className="text-rose-600">*</span></label>
                      <input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400",
                          errors.city ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="San Francisco"
                      />
                      {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">State / Province <span className="text-rose-600">*</span></label>
                      <input
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400",
                          errors.state ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="CA"
                      />
                      {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state}</p>}
                    </div>

                    {/* Zip code (mandatory for COD) */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        ZIP / Postal code <span className="text-rose-600">*</span>
                      </label>
                      <input
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400",
                          errors.zip ? "border-rose-300" : "border-zinc-300"
                        )}
                        placeholder="94107"
                      />
                      {errors.zip && <p className="mt-1 text-xs text-rose-600">{errors.zip}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">Country</label>
                      <div className="relative">
                        <select
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>India</option>
                        </select>
                        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">
                    For Cash on Delivery, we require your name, mobile number, full address, and ZIP code to confirm the delivery.
                  </p>
                </section>

                {/* Payment */}
                <section className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-zinc-900 text-white">
                      2
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-600">Payment method</h2>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <label
                      className={cn(
                        "relative flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 ring-1 transition",
                        payment === "cod" ? "border-zinc-900 ring-zinc-900/20" : "border-zinc-200 ring-transparent hover:border-zinc-300"
                      )}
                    >
                      <input type="radio" name="pay" className="sr-only" checked={payment === "cod"} onChange={() => setPayment("cod")} />
                      <div className="text-sm font-semibold">Cash on Delivery</div>
                      <div className="text-xs text-zinc-500">Pay when your order arrives. No extra fees.</div>
                      <div className={cn("absolute right-3 top-3 h-3 w-3 rounded-full border", payment === "cod" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300")} />
                    </label>

                    <label
                      className={cn(
                        "relative flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 ring-1 transition",
                        payment === "card" ? "border-zinc-900 ring-zinc-900/20" : "border-zinc-200 ring-transparent hover:border-zinc-300"
                      )}
                    >
                      <input type="radio" name="pay" className="sr-only" checked={payment === "card"} onChange={() => setPayment("card")} />
                      <div className="text-sm font-semibold">Card</div>
                      <div className="text-xs text-zinc-500">Visa, Mastercard, Amex</div>
                      <div className={cn("absolute right-3 top-3 h-3 w-3 rounded-full border", payment === "card" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300")} />
                    </label>

                    <label
                      className={cn(
                        "relative flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 ring-1 transition",
                        payment === "upi" ? "border-zinc-900 ring-zinc-900/20" : "border-zinc-200 ring-transparent hover:border-zinc-300"
                      )}
                    >
                      <input type="radio" name="pay" className="sr-only" checked={payment === "upi"} onChange={() => setPayment("upi")} />
                      <div className="text-sm font-semibold">UPI</div>
                      <div className="text-xs text-zinc-500">Pay via UPI ID</div>
                      <div className={cn("absolute right-3 top-3 h-3 w-3 rounded-full border", payment === "upi" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300")} />
                    </label>
                  </div>

                  {payment === "cod" && (
                    <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
                      <div className="font-semibold">Cash on Delivery selected</div>
                      <p className="mt-1">
                        Please ensure someone is available at the address to receive the package and provide payment. We’ll verify your phone number
                        for delivery updates.
                      </p>
                      <ul className="mt-2 list-disc pl-5 text-amber-900/80">
                        <li>We require: Name, Mobile Number, Address, and ZIP code (marked with *).</li>
                        <li>No card details are stored.</li>
                        <li>You’ll get SMS updates 24h and 2h before delivery.</li>
                      </ul>
                    </div>
                  )}

                  {payment === "card" && (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Card number</label>
                        <input className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" placeholder="4242 4242 4242 4242" inputMode="numeric" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Expiry</label>
                        <input className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">CVC</label>
                        <input className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" placeholder="•••" inputMode="numeric" />
                      </div>
                    </div>
                  )}

                  {payment === "upi" && (
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium">UPI ID</label>
                      <input className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" placeholder="name@bank" />
                    </div>
                  )}
                </section>

                {/* Promo */}
                <section className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
                  <div className="mb-3 text-sm font-semibold">Promo code</div>
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setApplyPromoMsg(null);
                      }}
                      placeholder="Enter code"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none"
                    />
                    <button onClick={applyPromo} className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800">
                      Apply
                    </button>
                  </div>
                  {applyPromoMsg && (
                    <p className={cn("mt-2 text-xs", applyPromoMsg.startsWith("Promo") ? "text-emerald-700" : "text-rose-600")}>{applyPromoMsg}</p>
                  )}
                  <p className="mt-2 text-[11px] text-zinc-500">Try NIMBUS10 for 10% off.</p>
                </section>
              </div>

              {/* Order summary */}
              <div className="col-span-2 border-l border-zinc-200 bg-zinc-50 p-6">
                <div className="text-sm font-semibold">Order summary</div>
                <div className="mt-4 space-y-3">
                  {cart.map((i) => (
                    <div key={i.product.id} className="flex gap-3">
                      <img src={i.product.image} className="h-16 w-16 rounded-xl object-cover ring-1 ring-zinc-200" />
                      <div className="flex flex-1 flex-col">
                        <div className="text-sm font-medium">{i.product.title}</div>
                        <div className="text-xs text-zinc-500">Qty {i.qty}</div>
                        <div className="mt-auto text-sm font-semibold">{currency.format(i.product.price * i.qty)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Subtotal</span>
                    <span className="font-medium">{currency.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : currency.format(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Tax (est.)</span>
                    <span className="font-medium">{currency.format(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Discount</span>
                      <span className="font-medium">−{currency.format(discount)}</span>
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-base">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-semibold">{currency.format(total)}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-white p-4 ring-1 ring-zinc-200">
                  <div className="text-sm font-semibold">Delivery estimate</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-zinc-600">
                    <IconTruck className="h-4 w-4" />
                    3–5 business days • Carbon-neutral shipping
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={cart.length === 0}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  Place order {payment === "cod" ? "(Cash on Delivery)" : ""}
                </button>
                <p className="mt-2 text-center text-[11px] text-zinc-500">
                  By placing your order, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white/60 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-sm sm:px-6 md:grid-cols-4 lg:px-8">
          <div>
            <div className="font-semibold">Nimbus Market</div>
            <p className="mt-2 text-zinc-500">Objects made to be used, loved, and kept.</p>
          </div>
          <div>
            <div className="font-medium">Shop</div>
            <ul className="mt-2 space-y-1 text-zinc-600">
              <li>New arrivals</li>
              <li>Best sellers</li>
              <li>Gift cards</li>
            </ul>
          </div>
          <div>
            <div className="font-medium">Company</div>
            <ul className="mt-2 space-y-1 text-zinc-600">
              <li>About</li>
              <li>Sustainability</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <div className="font-medium">Help</div>
            <ul className="mt-2 space-y-1 text-zinc-600">
              <li>Shipping & returns</li>
              <li>Contact us</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Nimbus Market. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
