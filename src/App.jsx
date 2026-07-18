import { useState, useMemo } from "react";

const pizzaMenu = [
  {
    id: 1,
    name: "Italian",
    category: "meat",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, mushrooms, chicken, cheese",
    ingredients: ["onion", "potato", "tomato", "mushrooms", "chicken"],
    prices: { s: 55000, m: 73000, l: 95000 },
  },
  {
    id: 2,
    name: "Venecia",
    category: "meat",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, mushrooms, meat, cheese",
    ingredients: ["onion", "potato", "tomato", "mushrooms", "meat"],
    prices: { s: 50000, m: 73000, l: 90000 },
  },
  {
    id: 3,
    name: "Meat",
    category: "meat",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, ham, sausage, cheese",
    ingredients: ["onion", "potato", "tomato", "ham", "sausage"],
    prices: { s: 55000, m: 93000, l: 110000 },
  },
  {
    id: 4,
    name: "Cheese",
    category: "vegetarian",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, basil, extra cheese",
    ingredients: ["onion", "potato", "tomato", "basil", "cheese"],
    prices: { s: 55000, m: 83000, l: 100000 },
  },
  {
    id: 5,
    name: "Argentina",
    category: "seafood",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, shrimps, mussels, cheese",
    ingredients: ["onion", "potato", "tomato", "shrimps", "mussels"],
    prices: { s: 60000, m: 73000, l: 95000 },
  },
  {
    id: 6,
    name: "Gribnaya",
    category: "vegetarian",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, mushrooms, olives, cheese",
    ingredients: ["onion", "potato", "tomato", "mushrooms", "olives"],
    prices: { s: 45000, m: 63000, l: 80000 },
  },
  {
    id: 7,
    name: "Tomato",
    category: "vegetarian",
    image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=400&h=400&fit=crop",
    description: "Filling: onion, fresh tomato, basil, mozzarella, pesto",
    ingredients: ["onion", "fresh tomato", "basil", "mozzarella", "pesto"],
    prices: { s: 45000, m: 73000, l: 85000 },
  },
  {
    id: 8,
    name: "Italian x2",
    category: "meat",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
    description: "Filling: onion, potato, tomato, mushrooms, double chicken, cheese",
    ingredients: ["onion", "potato", "tomato", "mushrooms", "chicken x2"],
    prices: { s: 60000, m: 83000, l: 105000 },
  },
];

const categories = [
  { id: "all", label: "Show All" },
  { id: "meat", label: "Meat" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "seafood", label: "Sea products" },
  { id: "mushroom", label: "Mushroom" },
];

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);
    setIsLoginOpen(false);
    setFormData({ email: "", firstName: "", lastName: "" });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getSelectedSize = (pizzaId) => selectedSizes[pizzaId] || "m";
  const getQuantity = (pizzaId) => quantities[pizzaId] || 1;

  const handleSizeChange = (pizzaId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [pizzaId]: size }));
  };

  const handleQuantityChange = (pizzaId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [pizzaId]: Math.max(1, (prev[pizzaId] || 1) + delta),
    }));
  };

  const addToCart = (pizza) => {
    const size = getSelectedSize(pizza.id);
    const qty = getQuantity(pizza.id);
    const price = pizza.prices[size];

    const cartItem = {
      id: Date.now(),
      pizzaId: pizza.id,
      name: pizza.name,
      size: size.toUpperCase(),
      qty,
      price,
      image: pizza.image,
    };

    setCart((prev) => [...prev, cartItem]);

    // Show feedback
    const btn = document.getElementById(`order-btn-${pizza.id}`);
    if (btn) {
      btn.textContent = "✓ Added!";
      btn.classList.add("bg-green-500");
      setTimeout(() => {
        btn.textContent = "Order Now";
        btn.classList.remove("bg-green-500");
      }, 1500);
    }

    // Reset quantity
    setQuantities((prev) => ({ ...prev, [pizza.id]: 1 }));
  };

  const filteredPizzas = useMemo(() => {
    if (activeCategory === "all") return pizzaMenu;
    if (activeCategory === "mushroom") {
      return pizzaMenu.filter((p) =>
        p.ingredients.some((i) => i.toLowerCase().includes("mushroom"))
      );
    }
    return pizzaMenu.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className={`min-h-screen bg-[#1a0f0a] text-white font-sans overflow-x-hidden ${(isLoginOpen || isCartOpen || isMobileMenuOpen) ? 'overflow-hidden' : ''}`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-5 max-w-7xl mx-auto">
        <div className="text-xl sm:text-2xl font-bold">
          <span className="text-orange-500">pizza</span>
          <span className="text-white">shop</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <a
            href="#"
            className="text-white hover:text-orange-500 transition-colors relative"
          >
            Home
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></span>
          </a>
          <a
            href="#menu"
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            Menu
          </a>
          <a
            href="#events"
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            Events
          </a>
          <a
            href="#about"
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            About us
          </a>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="hidden sm:block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 text-sm sm:text-base"
          >
            Log in
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 border border-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors group"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 border border-orange-500 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 sm:w-80 bg-[#2a1a12] shadow-2xl border-l border-orange-500/20 overflow-hidden flex flex-col animate-slide-in">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-5 border-b border-orange-500/20">
              <div className="text-xl font-bold">
                <span className="text-orange-500">pizza</span>
                <span className="text-white">shop</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 p-6">
              <div className="space-y-1">
                <a
                  href="#"
                  className="block px-4 py-3 text-white bg-orange-500/10 rounded-xl font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#menu"
                  className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-orange-500/10 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Menu
                </a>
                <a
                  href="#events"
                  className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-orange-500/10 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events
                </a>
                <a
                  href="#about"
                  className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-orange-500/10 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About us
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-orange-500/20">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            The Fastest
            <br />
            <span className="text-white">Pizza</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl mx-2">⚡</span>
            <span className="text-white">Delivery</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-md">
            We will deliver juicy pizza for your family in 30 minutes, if the
            courier is late –{" "}
            <span className="text-white font-semibold">pizza is free!</span>
          </p>

          <div className="space-y-4">
            <p className="text-gray-400">Cooking process:</p>
            <div className="relative w-36 h-24 sm:w-48 sm:h-32 rounded-2xl overflow-hidden group cursor-pointer border-2 border-orange-500/50">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop"
                alt="Pizza cooking"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href="#menu"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 inline-block text-sm sm:text-base"
            >
              To order
            </a>
            <a
              href="#menu"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 inline-block text-sm sm:text-base"
            >
              Pizza-Menu
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop"
              alt="Delicious pizza"
              className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-3xl shadow-2xl"
            />
          </div>
          <div className="absolute -top-4 -right-2 sm:-top-8 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 animate-bounce">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <path
                d="M50 10 L90 90 L10 90 Z"
                fill="#f97316"
                stroke="#ea580c"
                strokeWidth="2"
              />
              <circle cx="35" cy="60" r="8" fill="#dc2626" />
              <circle cx="55" cy="50" r="6" fill="#16a34a" />
              <circle cx="45" cy="70" r="7" fill="#eab308" />
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 w-24 h-32 sm:w-32 sm:h-40">
            <img
              src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&h=250&fit=crop"
              alt="Fries"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </main>

      {/* ==================== MENU SECTION ==================== */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10">
          Menu
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-[#2a1a12] text-gray-400 hover:text-white hover:bg-[#3a2a1a] border border-orange-500/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPizzas.map((pizza) => {
            const size = getSelectedSize(pizza.id);
            const qty = getQuantity(pizza.id);
            const currentPrice = pizza.prices[size];

            return (
              <div
                key={pizza.id}
                className="bg-[#2a1a12] rounded-2xl overflow-hidden border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 flex flex-col"
              >
                {/* Pizza Image */}
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {size.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{pizza.name}</h3>
                  <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                    {pizza.description}
                  </p>

                  {/* Ingredients */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pizza.ingredients.slice(0, 3).map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20"
                      >
                        {ing}
                      </span>
                    ))}
                    {pizza.ingredients.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
                        +{pizza.ingredients.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Size Selector */}
                  <div className="flex gap-2 mb-3">
                    {["s", "m", "l"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSizeChange(pizza.id, s)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-bold transition-all duration-200 ${
                          size === s
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                            : "bg-[#1a0f0a] text-gray-400 border border-orange-500/20 hover:border-orange-500/40"
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <span className="text-lg sm:text-xl font-bold text-orange-500">
                      {formatPrice(currentPrice * qty)}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1a0f0a] rounded-full border border-orange-500/20">
                      <button
                        onClick={() => handleQuantityChange(pizza.id, -1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white rounded-full transition-colors text-base sm:text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(pizza.id, 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white rounded-full transition-colors text-base sm:text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button
                    id={`order-btn-${pizza.id}`}
                    onClick={() => addToCart(pizza)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 text-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== EVENTS SECTION ==================== */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Events Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Row 1 */}
              <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop"
                  alt="How We Cooking"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm">How We Cooking</h4>
                  <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors">
                    More
                  </button>
                </div>
              </div>

              <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
                  alt="Our Blog"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm">Our Blog</h4>
                  <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors">
                    More
                  </button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
                  alt="Two Pizza For 1 Price"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm">Two Pizza<br/>For 1 Price</h4>
                  <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors">
                    More
                  </button>
                </div>
              </div>

              <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
                  alt="Kitchen Tour"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm">Kitchen Tour</h4>
                  <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors">
                    More
                  </button>
                </div>
              </div>

              {/* Row 3 */}
              <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
                  alt="Free Coffee For 3 Pizza"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm">Free Coffee<br/>For 3 Pizza</h4>
                  <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors">
                    More
                  </button>
                </div>
              </div>

              <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
                  alt="Our Instagram"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <h4 className="text-white font-bold text-xs sm:text-sm">Our Instagram</h4>
                  <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors">
                    More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Events Text */}
          <div className="lg:w-80 w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Events</h2>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              There are regular events in our pizzeria that will allow you to eat delicious food for a lower price!
            </p>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT US SECTION ==================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-5 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">About us</h2>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              In just a couple of years, we have opened 6 outlets in different cities: Kazan, Chelyabinsk, Ufa, Samara, Izhevsk, and in the future we plan to develop the network in other major cities of Russia.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-orange-500/30">
                  <img
                    src={`https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop&q=${i}`}
                    alt="Pizza variety"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
              The kitchen of each point is at least 400-500 sq. m. meters, hundreds of employees, smoothly running processes that allow us to prepare / deliver customer orders on time.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop"
              alt="About Pizzashop"
              className="w-full rounded-3xl shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-24 sm:h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg animate-bounce">
                <path
                  d="M50 10 L90 90 L10 90 Z"
                  fill="#f97316"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
                <circle cx="35" cy="60" r="8" fill="#dc2626" />
                <circle cx="55" cy="50" r="6" fill="#16a34a" />
                <circle cx="45" cy="70" r="7" fill="#eab308" />
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 w-20 h-28 sm:w-24 sm:h-32 lg:w-28 lg:h-36">
              <img
                src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&h=250&fit=crop"
                alt="Fries"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-orange-500/20 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Logo & Phone */}
            <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
              <div className="text-xl sm:text-2xl font-bold mb-4">
                <span className="text-orange-500">pizza</span>
                <span className="text-white">shop</span>
              </div>
              <a href="tel:+79373335033" className="text-orange-500 hover:text-orange-400 text-xs sm:text-sm">
                +7 (937) 333-50-33
              </a>
            </div>

            {/* Home Links */}
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Home</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">To Order</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">About us</a></li>
                <li><a href="#events" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Events</a></li>
                <li><a href="#menu" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Menu</a></li>
              </ul>
            </div>

            {/* Events Links */}
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Events</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">3 Pizza 1 Free Coffee</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">2 Pizza for 1 Price</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Kitchen Tour</a></li>
              </ul>
            </div>

            {/* Menu Links */}
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Menu</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="#menu" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Show All</a></li>
                <li><a href="#menu" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Sea products</a></li>
                <li><a href="#menu" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Vegan</a></li>
                <li><a href="#menu" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Meat</a></li>
              </ul>
            </div>

            {/* About Links */}
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">About Us</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Our History</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 text-xs sm:text-sm transition-colors">Why We?</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              © 2026 Pizzashop. All rights reserved.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== CART DRAWER ==================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full sm:w-full max-w-md bg-[#2a1a12] h-full shadow-2xl border-l border-orange-500/20 overflow-hidden flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Savatingiz
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {cart.length} mahsulot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="text-5xl sm:text-6xl mb-4">🛒</div>
                  <p className="text-gray-400 text-base sm:text-lg">Savatingiz bo'sh</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">
                    Menudan pizza tanlang
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 sm:gap-4 bg-[#1a0f0a] rounded-xl p-3 sm:p-4 border border-orange-500/20"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {item.size} • {item.qty} dona
                      </p>
                      <p className="text-orange-500 font-bold text-xs sm:text-sm mt-1">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setCart((prev) => prev.filter((c) => c.id !== item.id))
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Total */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-orange-500/20 bg-[#1a0f0a]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-gray-400 text-sm sm:text-base">Jami:</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-500">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 text-sm sm:text-base">
                  Buyurtma berish
                </button>
                <button
                  onClick={() => setCart([])}
                  className="w-full mt-2 text-gray-500 hover:text-red-400 py-2 text-xs sm:text-sm transition-colors"
                >
                  Savatni tozalash
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== LOGIN MODAL ==================== */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsLoginOpen(false)}
          />
          <div className="relative bg-[#2a1a12] rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-orange-500/20 transition-all duration-300 ease-out scale-100 opacity-100">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome Back!</h2>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Sign in to continue ordering delicious pizza
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-[#1a0f0a] border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Ism (First Name)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-[#1a0f0a] border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Familiya (Last Name)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-[#1a0f0a] border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 mt-5 sm:mt-6 text-sm sm:text-base"
              >
                Log in
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs sm:text-sm mt-5 sm:mt-6">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-orange-500 hover:text-orange-400">
                Sign up
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;