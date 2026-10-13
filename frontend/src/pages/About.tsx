import React from 'react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2070&auto=format&fit=crop" 
            alt="Crafting" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#3A2930] mb-4">Every Piece Has a Story.</h1>
          <p className="text-xl text-[#806B73]">Handcrafted with love, creativity, and thoughtfulness.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-lg text-[#3A2930] leading-relaxed mb-6">
            Soul Craft started from a simple love for creating beautiful things by hand. What began as a hobby making gifts for friends and family slowly blossomed into a small business dedicated to the art of craftsmanship.
          </p>
          <p className="text-lg text-[#3A2930] leading-relaxed">
            In a world of mass-produced goods, we believe in the magic of the handmade. Every item in our store is carefully crafted, inspected, and packaged with a personal touch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20" id="craftsmanship">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#3A2930] mb-6">Why Soul Craft?</h2>
            <ul className="space-y-6">
              {[
                { title: "Made with Love", desc: "Every stitch, fold, and brushstroke is made with care." },
                { title: "Customizable", desc: "Your ideas, brought to life through our craft." },
                { title: "Quality Checked", desc: "We ensure perfection in every piece before it leaves our studio." },
                { title: "Thoughtful Packaging", desc: "Unboxing should be just as joyful as the product itself." }
              ].map((item, i) => (
                <li key={i}>
                  <h4 className="font-bold text-[#3A2930] text-lg">{item.title}</h4>
                  <p className="text-[#806B73]">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-[400px] rounded-3xl overflow-hidden bg-[#FFF5F8]">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop" 
              alt="Handmade details" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
