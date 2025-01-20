"use client";

import { useCart } from "../../context/CartContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

const CartPage = () => {
  const { cart, removeFromCart, updateRentalDates, totalCost } = useCart();

  const handleDateChange = (id: string, startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      updateRentalDates(id, startDate.toISOString(), endDate.toISOString());
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Car Image */}
                <div className="flex justify-center items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>

                {/* Car Details */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-gray-600">{item.brand}</p>
                  <p className="text-gray-500">{item.type}</p>
                  <p className="text-gray-500">{item.fuelCapacity}</p>
                  <p className="text-gray-500">{item.transmission}</p>
                  <p className="text-gray-500">Seats: {item.seatingCapacity}</p>
                </div>

                {/* Rental Details */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <DatePicker
                        selected={new Date(item.rentalStartDate)}
                        onChange={(date) =>
                          handleDateChange(item.id, date, new Date(item.rentalEndDate))
                        }
                        className="w-full p-2 border rounded-md"
                        minDate={new Date()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <DatePicker
                        selected={new Date(item.rentalEndDate)}
                        onChange={(date) =>
                          handleDateChange(item.id, new Date(item.rentalStartDate), date)
                        }
                        className="w-full p-2 border rounded-md"
                        minDate={new Date(item.rentalStartDate)}
                      />
                    </div>
                  </div>
                  <p className="text-lg font-semibold">
                    Total: ${item.totalPrice}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total Cost and Checkout Button */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold">Total: ${totalCost}</p>
            <Link href="/payment">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;