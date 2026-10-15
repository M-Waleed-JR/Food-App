import Image from "next/image";

const OurStaff = () => {
  return (
    <section
      id="OurStaff"
      className="min-h-screen py-16 px-6 md:px-12 bg-black text-white flex items-center justify-center"
    >
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* text */}
        <div className="max-w-xl space-y-5 text-gray-300">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Our Team
            </h1>
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              Excellence • Dedication • Expertise
            </p>
          </div>

          <p className="leading-relaxed">
            Behind every great experience is a team driven by passion and
            unyielding commitment. At our core, we bring together highly skilled
            professionals who are leaders in their respective fields, united by
            a shared vision to deliver perfection in every detail.
          </p>

          <p className="leading-relaxed">
            Our experts combine decades of collective experience with continuous
            innovation. From mastering intricate techniques to constantly
            refining our approach, we ensure that every project meets the
            highest international standards of quality and efficiency.
          </p>

          <p className="leading-relaxed">
            We believe in collaboration, integrity, and relentless continuous
            improvement. We don&apos;t just execute tasks; we craft memorable
            solutions, build lasting trust, and shape exceptional outcomes for
            everyone we serve.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-800 text-center md:text-left">
            <div>
              <p className="text-2xl font-bold text-orange-500">+10</p>
              <p className="text-xs text-gray-400">Years Exp.</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">15+</p>
              <p className="text-xs text-gray-400">Master Chefs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">100%</p>
              <p className="text-xs text-gray-400">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* image */}
        <div className="relative h-[480px] w-full lg:w-[600px] shrink-0">
          <Image
            src="/OurStaff.webp"
            alt="staff"
            fill
            className="object-cover rounded-3xl shadow-2xl border border-zinc-800"
            priority
          />
          {/* Badge over image */}
          <div className="absolute -bottom-4 -left-4 bg-orange-600 text-white p-4 rounded-2xl shadow-xl text-center hidden sm:block">
            <span className="block text-2xl font-bold">+10</span>
            <span className="text-xs font-medium">Years Exp.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStaff;
