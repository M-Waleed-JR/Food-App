import Image from "next/image";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const Contact = () => {
  return (
    <section id="Contact" className="min-h-screen bg-neutral-950 pb-16">
      {/* Contact Us Header Overlay Text */}
      <header className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/ContactUs.webp"
          alt="Contact us"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
          <h1
            className={`text-white ${greatVibes.className} text-6xl sm:text-7xl md:text-8xl font-bold drop-shadow-lg mb-2`}
          >
            Contact Us
          </h1>

          <p className="text-white text-sm sm:text-base md:text-lg max-w-md font-medium drop-shadow-md mb-1">
            Get in touch with us for any inquiries or questions
          </p>

          <span className="text-[#cc9933] text-xs sm:text-sm md:text-base font-bold tracking-wider">
            10:00 AM – 11:00 PM
          </span>
        </div>
      </header>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 mt-12 md:mt-16 max-w-4xl">
        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-6 sm:p-10 rounded-2xl shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Send Us A Message
          </h2>

          <form className="space-y-6">
            {/* Name & Email inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3.5 text-white bg-neutral-800/90 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full p-3.5 text-white bg-neutral-800/90 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Phone & Subject inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3.5 text-white bg-neutral-800/90 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Inquiry about..."
                  className="w-full p-3.5 text-white bg-neutral-800/90 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Message input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full p-3.5 text-white bg-neutral-800/90 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-gray-500 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 text-white bg-red-600 hover:bg-red-700 font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
