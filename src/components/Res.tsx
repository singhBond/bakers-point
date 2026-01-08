// app/page.tsx

"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
    const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-700 tracking-wide">
            Paradise Resort
          </h1>

          <nav className="hidden md:flex items-center space-x-8 text-lg font-medium">
            <Link href="#home" className="hover:text-teal-600 transition">
              Home
            </Link>
            <Link href="#rooms" className="hover:text-teal-600 transition">
              Rooms
            </Link>
            <Link href="#reviews" className="hover:text-teal-600 transition">
              Reviews
            </Link>
            <Link href="#contact" className="hover:text-teal-600 transition">
              Contact
            </Link>
            <Link
              href="/book-res"
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Book your stay
            </Link>
          </nav>
             {/* Mobile Menu Button */}
          <button
            className="md:hidden text-teal-700 focus:outline-none"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <span className="text-3xl">✕</span>
            ) : (
              <span className="text-3xl">☰</span>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <nav className="flex flex-col px-6 py-6 space-y-4 text-lg font-medium">
              <Link
                href="#home"
                onClick={() => setOpen(false)}
                className="hover:text-teal-600"
              >
                Home
              </Link>
              <Link
                href="#rooms"
                onClick={() => setOpen(false)}
                className="hover:text-teal-600"
              >
                Rooms
              </Link>
              <Link
                href="#reviews"
                onClick={() => setOpen(false)}
                className="hover:text-teal-600"
              >
                Reviews
              </Link>
              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className="hover:text-teal-600"
              >
                Contact
              </Link>
              <Link
                href="/book-res"
                onClick={() => setOpen(false)}
                className="bg-teal-600 text-white text-center py-3 rounded-lg hover:bg-teal-700 transition"
              >
                Book your stay
              </Link>
            </nav>
          </div>
        )}
     

      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center"
      >
        <img
          src="https://echor.in/_next/image?url=https%3A%2F%2Fimages.echor.in%2Fhotels%2FEchor%20The%20Corbett%20Nishk%20Resort%2C%20Jim%20Corbett%20(2).jpg&w=3840&q=75"
          alt="Paradise Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Escape to Paradise
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Luxury resort & spa · unforgettable experiences await
          </p>
          <Link
            href="/book-res"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-10 rounded-xl text-xl transition shadow-lg"
          >
            Book your stay
          </Link>
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            Our luxurious rooms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Deluxe Swimming Pool",
                desc: "Spacious room with stunning Pool views and private balcony.",
                price: "$299 / night",
                img: "https://media.istockphoto.com/id/950689048/photo/enjoying-at-the-pool.jpg?s=612x612&w=0&k=20&c=fxwWZWo49mybI4MHkfYFg74GTJ5OCBr5Axo6p0xF3Hw=",
              },
              {
                title: "Executive Suite",
                desc: "Elegant suite with separate living area and king bed.",
                price: "$499 / night",
                img: "https://www.fontainebleaulasvegas.com/uploads/2024/08/Executive-Suite-D1.png",
              },
              {
                title: "Private Villa",
                desc: "Exclusive villa with private pool and full amenities.",
                price: "$899 / night",
                img: "https://portozante.com/wp-content/uploads/2023/06/greece-5-star-luxury-two-bedroom-private-villla-with-pool-royal-infinity-spa-villa-with-heated-pool-porto-zante-villas-and-spa-zakynthos-island-1367x911.webp",
              },
            ].map((room) => (
              <div
                key={room.title}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={room.img}
                  alt={room.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">
                    {room.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{room.desc}</p>
                  <p className="text-xl font-bold text-teal-600">
                    {room.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-teal-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            What our guests say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                name: "Sarah Johnson",
                text:
                  "The best resort experience ever! Stunning views and impeccable service.",
                img: "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg",
              },
              {
                name: "Michael Lee",
                text: "Paradise on earth. We'll definitely return!",
                img: "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <p className="text-lg italic mb-6">"{review.text}"</p>
                <div className="flex items-center">
                  <img
                    src={"https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-gray-500">★★★★★</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-teal-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Paradise Resort</h3>
            <p>
              123 Tropical Beach Road
              <br />
              Maldives Islands
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Contact us</h4>
            <p>
              Phone: +1 (555) 123-4567
              <br />
              Email: info@paradiseresort.com
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Follow us</h4>
            <p>Facebook · Instagram · Twitter</p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-teal-100">
          © 2026 Paradise Resort. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
