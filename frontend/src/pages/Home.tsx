import CoffeeScene from "../components/CoffeeScene";

interface Coffee {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
}

interface HomeProps {
  coffees: Coffee[];
  onLogin: () => void;
}

function Home({ coffees, onLogin }: HomeProps) {
  const availableCoffees = coffees.filter((coffee) => coffee.is_available);

  return (
    <main className="coffee-page overflow-hidden">
      <section className="min-h-[calc(100vh-80px)] flex items-center relative">
        <div className="coffee-container w-full py-16 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-[var(--coffee-brown)]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--coffee-brown)]">
                  Specialty Coffee · Est. 2026
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold leading-[0.9] text-[var(--coffee-dark)]">
                Coffee made
                <br />
                <span className="italic font-serif font-normal">with</span>
                <br />
                <span className="italic font-serif font-normal">intention.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base md:text-lg leading-8 text-[var(--text-muted)]">
                Carefully sourced beans, thoughtful roasting, and beautifully crafted cups made for slow mornings, good conversations, and everything in between.
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-8">
                <a href="#menu" className="coffee-button inline-flex items-center gap-3">
                  Explore our menu <span>↗</span>
                </a>
                <a href="#about" className="font-semibold border-b pb-1 text-[var(--coffee-dark)] border-[var(--coffee-dark)]">
                  Our story
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-7 mt-14 pt-7 border-t border-black/10 max-w-xl">
                <div>
                  <p className="text-xl font-bold text-[var(--coffee-dark)]">01</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] coffee-muted mt-2">Carefully sourced</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[var(--coffee-dark)]">02</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] coffee-muted mt-2">Small-batch roasted</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[var(--coffee-dark)]">03</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] coffee-muted mt-2">Freshly brewed</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[430px] sm:min-h-[520px] flex items-center justify-center">
              <div className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full bg-[rgba(111,78,55,0.08)] blur-[1px]" />
              <div className="absolute w-[330px] h-[330px] sm:w-[500px] sm:h-[500px] rounded-full border border-[rgba(111,78,55,0.16)]" />
              <div className="relative z-10 w-full">
                <CoffeeScene />
              </div>
              <div className="absolute bottom-5 right-2 sm:right-8 z-20 text-right">
                <span className="block text-[9px] uppercase tracking-[0.3em] text-[var(--coffee-brown)]">Crafted Daily</span>
                <strong className="font-serif text-xl text-[var(--coffee-dark)]">Fresh. Warm. Yours.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-white">
        <div className="coffee-container">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--coffee-brown)]">Our Menu</p>
            <h2 className="text-4xl md:text-5xl font-bold coffee-heading mt-3">Crafted for every moment</h2>
            <p className="coffee-muted max-w-xl mx-auto mt-4">Discover our selection of freshly prepared coffee, made with carefully selected beans.</p>
          </div>

          {availableCoffees.length === 0 ? (
            <div className="coffee-card p-10 text-center">
              <div className="text-5xl mb-4">☕</div>
              <h3 className="text-xl font-bold coffee-heading">Menu coming soon</h3>
              <p className="coffee-muted mt-2">Our coffee menu is being prepared.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCoffees.map((coffee) => (
                <article key={coffee.id} className="coffee-card p-6 group hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-[rgba(111,78,55,0.10)]">☕</div>
                    <span className="font-bold text-[var(--coffee-brown)]">₹{coffee.price}</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.15em] mt-6 text-[var(--coffee-brown)]">{coffee.category}</p>
                  <h3 className="text-xl font-bold coffee-heading mt-2">{coffee.name}</h3>
                  <p className="coffee-muted mt-3 leading-6">{coffee.description}</p>
                  <div className="mt-6 h-px w-0 group-hover:w-full transition-all duration-500 bg-[var(--coffee-brown)]" />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-24">
        <div className="coffee-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--coffee-brown)]">About CoffeeHub</p>
              <h2 className="text-4xl md:text-6xl font-bold coffee-heading mt-4 leading-tight">
                More than coffee.<br />It's a moment.
              </h2>
            </div>
            <div>
              <p className="coffee-muted text-lg leading-8">
                At CoffeeHub, we believe great coffee should slow things down. From carefully selected beans to every freshly brewed cup, we focus on quality, simplicity, and the moments that happen around coffee.
              </p>
              <button onClick={onLogin} className="coffee-button mt-8">Admin Login</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
