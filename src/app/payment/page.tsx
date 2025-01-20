"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

// Define the combined validation schema using Zod
const billingInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

const rentalInfoSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup location is required"),
  dropoffLocation: z.string().min(1, "Dropoff location is required"),
});

const formSchema = billingInfoSchema.merge(rentalInfoSchema);

type FormData = z.infer<typeof formSchema>;

// Static list of cities
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "San Francisco",
  "Charlotte",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
];

export default function PaymentPage() {
  const { cart, totalCost } = useCart();
  const [paymentMethod, setPaymentMethod] = React.useState("creditCard");

  // Initialize react-hook-form for the combined form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Combine form data with cart data
    const rentalData = {
      ...data,
      pickupDate: cart[0]?.rentalStartDate, // Use dates from the cart
      dropoffDate: cart[0]?.rentalEndDate, // Use dates from the cart
      totalPrice: totalCost,
      paymentMethod,
    };

    console.log("Rental Data to be saved:", rentalData);

    // Save the rental data to Sanity (via your backend API)
    fetch('/api/rentals', { method: 'POST', body: JSON.stringify(rentalData) })

    alert("Payment successful!");
  };

  return (
    <div className="w-full bg-[#f6f7f9] p-4 sm:p-6 flex flex-col lg:flex-row gap-6 font-[family-name:var(--font-geist-sans)]">
      {/* Left Side: Payment Steps */}
      <div className="w-full lg:w-[70%] space-y-6">
        {/* Billing Info */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Info</CardTitle>
            <CardDescription className="flex justify-between">
              <span>Please enter your billing info</span>
              <span>Step 1 of 4</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold">Name</label>
                  <Input
                    {...register("name")}
                    placeholder="Your Name"
                    className="bg-[#f6f7f9] h-14 rounded-xl"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Phone Number</label>
                  <Input
                    {...register("phone")}
                    placeholder="Your Phone Number"
                    className="bg-[#f6f7f9] h-14 rounded-xl"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold">Address</label>
                  <Input
                    {...register("address")}
                    placeholder="Your Address"
                    className="bg-[#f6f7f9] h-14 rounded-xl"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Town/City</label>
                  <select
                    {...register("city")}
                    className="bg-[#f6f7f9] w-full h-14 rounded-xl px-4"
                  >
                    <option value="">Select Your City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city.message}</p>
                  )}
                </div>
              </div>

              {/* Rental Info */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-2">
                  <Image src="/Pick - Up (1).png" alt="Pick Up" width={92} height={20} />
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Pickup Location</label>
                  <select
                    {...register("pickupLocation")}
                    className="bg-[#f6f7f9] w-full h-14 rounded-xl px-4"
                  >
                    <option value="">Select Your City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.pickupLocation && (
                    <p className="text-red-500 text-sm">{errors.pickupLocation.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/Drop - Off (1).png" alt="Drop Off" width={104} height={20} />
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Dropoff Location</label>
                  <select
                    {...register("dropoffLocation")}
                    className="bg-[#f6f7f9] w-full h-14 rounded-xl px-4"
                  >
                    <option value="">Select Your City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.dropoffLocation && (
                    <p className="text-red-500 text-sm">{errors.dropoffLocation.message}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription className="flex justify-between">
                      <span>Please enter your payment method</span>
                      <span>Step 3 of 4</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Button
                        variant={paymentMethod === "creditCard" ? "default" : "outline"}
                        onClick={() => handlePaymentMethodChange("creditCard")}
                        className="w-full h-14"
                      >
                        Credit Card
                      </Button>
                      <Button
                        variant={paymentMethod === "paypal" ? "default" : "outline"}
                        onClick={() => handlePaymentMethodChange("paypal")}
                        className="w-full h-14"
                      >
                        PayPal
                      </Button>
                      <Button
                        variant={paymentMethod === "bitcoin" ? "default" : "outline"}
                        onClick={() => handlePaymentMethodChange("bitcoin")}
                        className="w-full h-14"
                      >
                        Bitcoin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Confirmation */}
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Confirmation</CardTitle>
                    <CardDescription className="flex justify-between">
                      <span>We are getting to the end. Just a few clicks and your rental is ready</span>
                      <span>Step 4 of 4</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button type="submit" className="w-full h-14 bg-[#3563e9]">
                      Rent Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Side: Rental Summary */}
      <div className="w-full lg:w-[30%]">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Rental Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="space-y-2">
                <p className="font-bold">{item.name}</p>
                <p className="text-gray-500">
                  {new Date(item.rentalStartDate).toLocaleDateString()} -{" "}
                  {new Date(item.rentalEndDate).toLocaleDateString()}
                </p>
                <p className="text-gray-500">${item.totalPrice}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <p className="font-bold">Total: ${totalCost}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}