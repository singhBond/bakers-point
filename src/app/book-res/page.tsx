// app/booking/page.tsx
"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingPage() {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState("deluxe");

  const roomPrices: Record<string, number> = {
    deluxe: 8500,
    suite: 14500,
    villa: 26000,
  };

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const total = nights > 0 ? nights * roomPrices[roomType] : 0;

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-700">
            Paradise Resort
          </h1>
          <nav className="hidden md:flex space-x-8 text-lg">
            <a href="/" className="hover:text-teal-600 transition">
              Home
            </a>
            <a href="/#rooms" className="hover:text-teal-600 transition">
              Rooms
            </a>
            <span className="text-teal-700 font-semibold">
              Booking
            </span>
            
          </nav>
        </div>
        
      </header>

      {/* Hero */}
      <section className="relative h-[420px] mt-20">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
          alt="Luxury Indian Resort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <p className="uppercase tracking-widest text-sm mb-3 text-amber-200">
            Atithi Devo Bhava
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Book your peaceful escape
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            Luxury · Nature · Indian hospitality
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-teal-700">
                Your stay details
              </h3>

              <div className="space-y-7">
                <div>
                  <label className="block font-medium mb-2">
                    Check-in date
                  </label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date: Date | null) => setCheckIn(date)}
                    minDate={new Date()}
                    className="w-full p-4 border rounded-xl"
                    placeholderText="Select check-in"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Check-out date
                  </label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date: Date | null) => setCheckOut(date)}
                    minDate={checkIn || new Date()}
                    className="w-full p-4 border rounded-xl"
                    placeholderText="Select check-out"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) =>
                        setAdults(Number(e.target.value))
                      }
                      className="w-full p-4 border rounded-xl"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">
                      Children
                    </label>
                    <select
                      value={children}
                      onChange={(e) =>
                        setChildren(Number(e.target.value))
                      }
                      className="w-full p-4 border rounded-xl"
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Room type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) =>
                      setRoomType(e.target.value)
                    }
                    className="w-full p-4 border rounded-xl"
                  >
                    <option value="deluxe">
                      Deluxe Room – ₹8,500 / night
                    </option>
                    <option value="suite">
                      Executive Suite – ₹14,500 / night
                    </option>
                    <option value="villa">
                      Private Villa – ₹26,000 / night
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="bg-teal-50 rounded-2xl p-8 h-fit">
              <h3 className="text-3xl font-bold mb-6 text-teal-800">
                Booking summary
              </h3>

              <div className="space-y-4 text-lg">
                <p>
                  <strong>Check-in:</strong>{" "}
                  {checkIn
                    ? checkIn.toLocaleDateString("en-IN")
                    : "-"}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {checkOut
                    ? checkOut.toLocaleDateString("en-IN")
                    : "-"}
                </p>
                <p>
                  <strong>Nights:</strong> {nights || "-"}
                </p>
                <p>
                  <strong>Guests:</strong> {adults} Adults,{" "}
                  {children} Children
                </p>
                <p>
                  <strong>Room:</strong>{" "}
                  {roomType.charAt(0).toUpperCase() +
                    roomType.slice(1)}
                </p>

                <hr className="my-6 border-teal-200" />

                <p className="text-2xl font-bold text-teal-700">
                  Total: ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              <button className="w-full mt-10 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-5 rounded-xl text-xl transition shadow-lg">
                Confirm booking
              </button>

              <p className="text-sm text-gray-600 mt-4 text-center">
                * Demo booking · No payment will be charged
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
