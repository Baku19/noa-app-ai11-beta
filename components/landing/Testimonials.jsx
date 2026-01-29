import React from 'react';

const testimonials = [
  {
    quote: "Finally, I can see exactly where my daughter needs help. The writing feedback alone is worth it — her teacher noticed the improvement!",
    name: "Sarah M.",
    location: "Sydney, NSW",
    child: "Mum of Year 4 student"
  },
  {
    quote: "My son actually asks to do his Noa sessions. It doesn't feel like homework to him. The 20-minute sessions are perfect for busy evenings.",
    name: "James T.",
    location: "Melbourne, VIC",
    child: "Dad of Year 5 student"
  },
  {
    quote: "We tried tutoring but it was expensive and inflexible. Noa adapts to my kids' schedules and I can track everything from my phone.",
    name: "Michelle K.",
    location: "Brisbane, QLD",
    child: "Mum of Year 3 & 6 students"
  }
];

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-amber-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Parents Love Noa
          </h2>
          <p className="text-xl text-slate-500">
            Join thousands of Australian families
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <blockquote className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold text-slate-800">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.child}</p>
                <p className="text-sm text-slate-400">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
