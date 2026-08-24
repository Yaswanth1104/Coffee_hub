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
  const availableCoffees = coffees.filter(
    (coffee) => coffee.is_available
  );

  return (
    <main className="coffee-page">

      {/* ================= HERO ================= */}

      <section className="min-h-[calc(100vh-80px)] flex items-center">
        <div className="coffee-container w-full">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}

            <div>

              <div className="flex items-center gap-3 mb-6">
                <span
                  className="w-8 h-px"
                  style={{
                    background: "var(--coffee-brown)",
                  }}
                />

                <span
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{
                    color: "var(--coffee-brown)",
                  }}
                >
                  Specialty Coffee · Est. 2026
                </span>
              </div>

              <h1
                className="text-5xl md:text-7xl font-bold leading-[0.95]"
                style={{
                  color: "var(--coffee-dark)",
                }}
              >
                Coffee made
                <br />

                <span className="italic font-serif">
                  with
                </span>

                <br />

                <span className="italic font-serif">
                  intention.
                </span>
              </h1>

              <p
                className="mt-8 max-w-xl text-base md:text-lg leading-8"
                style={{
                  color: "var(--coffee-muted)",
                }}
              >
                Carefully sourced beans, thoughtful roasting,
                and beautifully crafted cups made for slow
                mornings, good conversations, and everything
                in between.
              </p>

              {/* Buttons */}

              <div className="flex items-center gap-6 mt-8">

                <a
                  href="#menu"
                  className="coffee-button inline-flex items-center gap-3"
                >
                  Explore our menu
                  <span>↗</span>
                </a>

                <a
                  href="#about"
                  className="font-semibold border-b pb-1"
                  style={{
                    color: "var(--coffee-dark)",
                    borderColor: "var(--coffee-dark)",
                  }}
                >
                  Our story
                </a>

              </div>

              {/* Features */}

              <div className="grid grid-cols-3 gap-6 mt-14 pt-7 border-t max-w-xl">
                
                <div>
                  <p
                    className="text-xl font-bold"
                    style={{
                      color: "var(--coffee-dark)",
                    }}
                  >
                    01
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.15em] coffee-muted mt-2">
                    Carefully sourced
                  </p>
                </div>

                <div>
                  <p
                    className="text-xl font-bold"
                    style={{
                      color: "var(--coffee-dark)",
                    }}
                  >
                    02
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.15em] coffee-muted mt-2">
                    Small-batch roasted
                  </p>
                </div>

                <div>
                  <p
                    className="text-xl font-bold"
                    style={{
                      color: "var(--coffee-dark)",
                    }}
                  >
                    03
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.15em] coffee-muted mt-2">
                    Freshly brewed
                  </p>
                </div>

              </div>

            </div>

            {/* Right Visual */}

            <div className="flex justify-center items-center">

              <div className="relative w-full max-w-xl aspect-square flex items-center justify-center">

                {/* Decorative circles */}

                <div
                  className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border"
                  style={{
                    borderColor:
                      "rgba(111, 78, 55, 0.18)",
                  }}
                />

                <div
                  className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full"
                  style={{
                    background:
                      "rgba(111, 78, 55, 0.08)",
                  }}
                />

                {/* Coffee Cup */}

                <div className="relative z-10 text-center">

                  <div className="text-[150px] md:text-[210px] drop-shadow-2xl">
                    ☕
                  </div>

                  <div
                    className="mt-[-30px] text-sm uppercase tracking-[0.4em] font-semibold"
                    style={{
                      color: "var(--coffee-brown)",
                    }}
                  >
                    Crafted Daily
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= MENU ================= */}

      <section
        id="menu"
        className="py-24"
        style={{
          background: "#fff",
        }}
      >
        <div className="coffee-container">

          <div className="text-center mb-14">

            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{
                color: "var(--coffee-brown)",
              }}
            >
              Our Menu
            </p>

            <h2 className="text-4xl md:text-5xl font-bold coffee-heading mt-3">
              Crafted for every moment
            </h2>

            <p className="coffee-muted max-w-xl mx-auto mt-4">
              Discover our selection of freshly prepared
              coffee, made with carefully selected beans.
            </p>

          </div>

          {availableCoffees.length === 0 ? (

            <div className="coffee-card p-10 text-center">
              <div className="text-5xl mb-4">
                ☕
              </div>

              <h3 className="text-xl font-bold coffee-heading">
                Menu coming soon
              </h3>

              <p className="coffee-muted mt-2">
                Our coffee menu is being prepared.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {availableCoffees.map((coffee) => (

                <div
                  key={coffee.id}
                  className="coffee-card p-6 hover:-translate-y-1 transition-transform duration-300"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                      style={{
                        background:
                          "rgba(111, 78, 55, 0.10)",
                      }}
                    >
                      ☕
                    </div>

                    <span
                      className="font-bold"
                      style={{
                        color: "var(--coffee-brown)",
                      }}
                    >
                      ₹{coffee.price}
                    </span>

                  </div>

                  <p
                    className="text-xs uppercase tracking-[0.15em] mt-6"
                    style={{
                      color: "var(--coffee-brown)",
                    }}
                  >
                    {coffee.category}
                  </p>

                  <h3 className="text-xl font-bold coffee-heading mt-2">
                    {coffee.name}
                  </h3>

                  <p className="coffee-muted mt-3 leading-6">
                    {coffee.description}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="py-24"
      >
        <div className="coffee-container">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>

              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{
                  color: "var(--coffee-brown)",
                }}
              >
                About CoffeeHub
              </p>

              <h2 className="text-4xl md:text-5xl font-bold coffee-heading mt-4 leading-tight">
                More than coffee.
                <br />
                It's a moment.
              </h2>

            </div>

            <div>

              <p className="coffee-muted text-lg leading-8">
                At CoffeeHub, we believe great coffee should
                slow things down. From carefully selected beans
                to every freshly brewed cup, we focus on quality,
                simplicity, and the moments that happen around
                coffee.
              </p>

              <button
                onClick={onLogin}
                className="coffee-button mt-8"
              >
                Admin Login
              </button>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;