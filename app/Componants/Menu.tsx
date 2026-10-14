import Image from "next/image";

// Menu Data

const menuData = {
  burgers: [
    {
      name: "Classic Cheeseburger",
      price: "150 EGP",
      description:
        "Beef patty, cheddar cheese, lettuce, tomato, special gusto sauce.",
    },
    {
      name: "Mushroom Swiss Burger",
      price: "185 EGP",
      description:
        "Sautéed mushrooms, swiss cheese, caramelized onions, garlic mayo.",
    },
    {
      name: "Smoky BBQ Bacon",
      price: "210 EGP",
      description:
        "Double beef patty, crispy bacon, cheddar, onion rings, BBQ sauce.",
    },
    {
      name: "Spicy Crispy Chicken",
      price: "165 EGP",
      description:
        "Fried chicken breast, jalapenos, spicy sriracha mayo, coleslaw.",
    },
    {
      name: "Double Ultimate Gusto",
      price: "230 EGP",
      description:
        "Two beef patties, double cheddar, smoked beef bacon, special sauce.",
    },
  ],
  pizzas: [
    {
      name: "Margherita Supreme",
      price: "130 EGP",
      description: "Fresh mozzarella, tomato sauce, basil, olive oil.",
    },
    {
      name: "Pepperoni Passion",
      price: "180 EGP",
      description:
        "Loaded pepperoni, mozzarella cheese, oregano, classic tomato sauce.",
    },
    {
      name: "Quattro Formaggi",
      price: "195 EGP",
      description: "Mozzarella, cheddar, blue cheese, parmesan, herbs.",
    },
    {
      name: "Chicken BBQ Ranch",
      price: "175 EGP",
      description:
        "Grilled chicken, BBQ drizzle, ranch sauce, red onions, mozzarella.",
    },
    {
      name: "Super Supreme Veggie",
      price: "160 EGP",
      description:
        "Mushrooms, bell peppers, olives, onions, sweet corn, mozzarella.",
    },
  ],
  Pasta: [
    {
      name: "Creamy Chicken Alfredo",
      price: "155 EGP",
      description:
        "Fettuccine pasta, grilled chicken strips, rich white cream sauce, parmesan.",
    },
    {
      name: "Spicy Arrabbiata",
      price: "120 EGP",
      description:
        "Penne pasta, spicy tomato sauce, garlic, black olives, fresh basil.",
    },
    {
      name: "Four Cheese Pasta",
      price: "170 EGP",
      description:
        "Penne pasta blended with a rich mixture of four melted cheeses.",
    },
    {
      name: "Beef Bolognese",
      price: "165 EGP",
      description:
        "Spaghetti with traditional slow-cooked minced beef and rich tomato sauce.",
    },
    {
      name: "Shrimp Pesto Pasta",
      price: "195 EGP",
      description:
        "Spaghetti, sautèed shrimp, homemade basil pesto sauce, parmesan cheese.",
    },
  ],
  FriedChicken: [
    {
      name: "Crispy Chicken Bucket (8 pcs)",
      price: "290 EGP",
      description:
        "8 pieces of golden crispy fried chicken, served with fries and coleslaw.",
    },
    {
      name: "Spicy Strips Meal",
      price: "160 EGP",
      description:
        "5 pieces of fiery crunchy chicken strips, garlic dip, and french fries.",
    },
    {
      name: "Family Feast Box",
      price: "450 EGP",
      description:
        "12 pieces chicken, large fries, family coleslaw, large gravy, 4 buns.",
    },
    {
      name: "Cheesy Chicken Fillet",
      price: "175 EGP",
      description:
        "Fried chicken breasts topped with melted cheddar cheese sauce.",
    },
    {
      name: "Honey Mustard Chicken",
      price: "165 EGP",
      description:
        "Crispy chicken tenders tossed in sweet and tangy honey mustard glaze.",
    },
  ],
};

const Menu = () => {
  return (
    <section id="Menu" className="text-white">
      {/* ================= Burgers Section ================= */}
      <div className="relative min-h-screen w-full flex items-center px-8 md:px-20 py-16">
        <Image
          src="/Home materials/Burger.webp"
          alt="Burger Background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay & Blur */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10" />

        {/* Menu Content */}
        <div className="relative z-20 max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 border-b-2 border-red-500/40 pb-3">
            Burgers Menu
          </h2>

          <div className="space-y-6">
            {menuData.burgers.map((item, index) => (
              <div key={index} className="border-b border-gray-700/60 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                  <span className="text-lg md:text-xl font-bold text-yellow-400">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-300 italic">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Pizza Section ================= */}
      <div className="relative min-h-screen w-full flex items-center px-8 md:px-20 py-16">
        <Image
          src="/Home materials/Pizza.webp"
          alt="Pizza Background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10" />

        <div className="relative z-20 max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 border-b-2 border-red-500/40 pb-3">
            Pizzas Menu
          </h2>

          <div className="space-y-6">
            {menuData.pizzas.map((item, index) => (
              <div key={index} className="border-b border-gray-700/60 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                  <span className="text-lg md:text-xl font-bold text-yellow-400">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-300 italic">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ================= pasta Section ================= */}
      <div className="relative min-h-screen w-full flex items-center px-8 md:px-20 py-16">
        <Image
          src="/Home materials/Pasta.webp"
          alt="Pizza Background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10" />

        <div className="relative z-20 max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 border-b-2 border-red-500/40 pb-3">
            Pastas Menu
          </h2>

          <div className="space-y-6">
            {menuData.Pasta.map((item, index) => (
              <div key={index} className="border-b border-gray-700/60 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                  <span className="text-lg md:text-xl font-bold text-yellow-400">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-300 italic">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ================= Fried Chicken Section ================= */}
      <div className="relative min-h-screen w-full flex items-center px-8 md:px-20 py-16">
        <Image
          src="/Home materials/FriedChicken.webp"
          alt="Pizza Background"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10" />

        <div className="relative z-20 max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 border-b-2 border-red-500/40 pb-3">
            Fried Chicken Menu
          </h2>

          <div className="space-y-6">
            {menuData.FriedChicken.map((item, index) => (
              <div key={index} className="border-b border-gray-700/60 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                  <span className="text-lg md:text-xl font-bold text-yellow-400">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-300 italic">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
