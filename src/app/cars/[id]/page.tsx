"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import { useCart } from "../../../context/CartContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

interface Car {
  _id: string;
  name: string;
  model: string;
  year: number;
  type: string;
  image?: { asset: { _ref: string } };
  brand: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  pricePerDay: number;
}

interface Rental {
  startDate: string;
  endDate: string;
}

const CarPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const { addToCart } = useCart();
  const [cartMessage, setCartMessage] = useState<string>("");

  useEffect(() => {
    if (id) {
      const fetchCarAndBookings = async () => {
        try {
          // Fetch car details
          const carQuery = `*[_type == "car" && _id == $id][0]{
            _id, name, model, year, type, image, brand, fuelCapacity, transmission, seatingCapacity, pricePerDay
          }`;
          const fetchedCar = await client.fetch<Car>(carQuery, { id });
          if (!fetchedCar) {
            throw new Error("Car not found");
          }
          setCar(fetchedCar);

          // Fetch booked dates for this car
          const rentalQuery = `*[_type == "rental" && car._ref == $id]{
            startDate,
            endDate
          }`;
          const rentals = await client.fetch<Rental[]>(rentalQuery, { id });

          // Convert booked dates to Date objects
          const dates: Date[] = [];
          rentals.forEach((rental) => {
            const start = new Date(rental.startDate);
            const end = new Date(rental.endDate);
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
              dates.push(new Date(d));
            }
          });
          setBookedDates(dates);
        } catch (err) {
          setError("Error fetching car data");
        } finally {
          setLoading(false);
        }
      };

      fetchCarAndBookings();
    }
  }, [id]);

  // Calculate duration and total price
  const duration = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = car ? duration * car.pricePerDay : 0;

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => date.toDateString() === bookedDate.toDateString()
    );
  };

  const handleAddToCart = () => {
    if (!car || !startDate || !endDate) {
      setCartMessage("Please select valid rental dates.");
      return;
    }

    if (startDate >= endDate) {
      setCartMessage("End date must be after start date.");
      return;
    }

    if (isDateBooked(startDate) || isDateBooked(endDate)) {
      setCartMessage("Selected dates are not available.");
      return;
    }

    const cartItem = {
      id: car._id,
      name: car.name,
      brand: car.brand,
      type: car.type,
      fuelCapacity: car.fuelCapacity,
      transmission: car.transmission,
      seatingCapacity: car.seatingCapacity,
      pricePerDay: car.pricePerDay,
      rentalStartDate: startDate.toISOString(),
      rentalEndDate: endDate.toISOString(),
      totalPrice,
      image: car.image ? urlFor(car.image.asset._ref).url() : "",
    };
    addToCart(cartItem);
    setCartMessage(`Added ${car.name} to your cart!`);

    // Clear the message after 3 seconds
    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  if (loading) return <div className="text-center text-xl text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;
  if (!car) return <div className="text-center text-xl text-gray-500">Car not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Car Image */}
        <div className="flex justify-center items-center">
          {car.image ? (
            <img
              src={urlFor(car.image.asset._ref).url()}
              alt={car.name}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex justify-center items-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{car.name}</h1>
          <p className="text-lg font-semibold text-purple-600">
            Rs {car.pricePerDay} / day
          </p>
          <p className="text-gray-600">
            {car.model} | {car.year} | {car.transmission}
          </p>
          <p className="text-gray-500">
            {car.fuelCapacity} fuel capacity | Seats: {car.seatingCapacity}
          </p>

          {/* Booking Form */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-full p-2 border rounded-md"
                  minDate={new Date()}
                  placeholderText="Select start date"
                  excludeDates={bookedDates} // Disable booked dates
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="w-full p-2 border rounded-md"
                  minDate={startDate || new Date()}
                  placeholderText="Select end date"
                  excludeDates={bookedDates} // Disable booked dates
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-lg font-semibold">
                Total Price: <span className="text-purple-600">Rs {totalPrice}</span>
              </p>
              <p className="text-sm text-gray-500">({duration} days)</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <Link href="/cart">
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
                  Go To Cart
                </button>
              </Link>
            </div>

            {/* Cart Message */}
            {cartMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg text-center">
            {cartMessage}
          </div>
        )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPage;