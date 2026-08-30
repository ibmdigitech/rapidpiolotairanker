"use client";

const stats = [
  { value: "10K+", label: "Websites Optimised" },
  { value: "50M+", label: "Keywords Crawled" },
  { value: "98.4%", label: "Satisfaction Rate" },
  { value: "5.4x", label: "Average Traffic Lift" },
];

export default function StatsBar() {
  return (
    <section className="py-12 border-y border-white/5 bg-neutral-950/40 backdrop-blur-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="flex flex-col space-y-1"
            >
              <span className="text-3xl sm:text-4xl font-heading font-extrabold bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
