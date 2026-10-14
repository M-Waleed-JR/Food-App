import Image from "next/image";

const AboutUs = () => {
  return (
    <section
      id="AboutUs"
      className="bg-black text-white min-h-screen py-16 px-6 md:px-12 flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Our Story
            </h2>
            <p className="text-stone-400 text-lg font-medium">
              Authentic Italian Taste • With an Egyptian Twist
            </p>
          </div>

          <div className="space-y-4 text-stone-300 leading-relaxed text-base md:text-lg">
            <p>
              It all started with a simple passion: bringing the rich,
              heartwarming recipes of Italy to the vibrant tables of Egypt. At{" "}
              <span className="text-white font-semibold">Gusto</span>, we bridge
              two iconic food cultures.
            </p>
            <p>
              We take classic Italian dishes—from handcrafted pastas to
              wood-fired pizzas—and elevate them with a distinct, generous
              Egyptian flair.
            </p>
            <p>
              Every plate is crafted using fresh, premium ingredients and a
              touch of local magic. We don&apos;t just serve food; we share a
              story of passion, tradition, and togetherness in every single
              bite.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-500">
                +100K
              </p>
              <p className="text-xs md:text-sm text-stone-400">Happy Clients</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-500">
                +50
              </p>
              <p className="text-xs md:text-sm text-stone-400">
                Special Dishes
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-amber-500">
                ★ 4.5
              </p>
              <p className="text-xs md:text-sm text-stone-400">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Right Column: Image with Floating Badge */}
        <div className="relative">
          <div className="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
            <Image
              src="/AboutUs.webp"
              alt="About Gusto"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Floating Experience Badge */}
          <div className="absolute -bottom-6 -right-4 bg-amber-700/90 backdrop-blur-md text-white p-4 sm:p-6 rounded-xl shadow-xl border border-amber-600/50 text-center min-w-[120px]">
            <p className="text-2xl sm:text-3xl font-extrabold">+10</p>
            <p className="text-xs sm:text-sm font-medium text-stone-200">
              Years Exp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
