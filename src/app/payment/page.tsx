"use client";

import React, { useEffect, useState } from "react";
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
const combinedSchema = z.object({
  // Billing Info
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),

  // Rental Info
  pickupLocation: z.string().min(1, "Pickup location is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  dropoffLocation: z.string().min(1, "Dropoff location is required"),
  dropoffDate: z.string().min(1, "Dropoff date is required"),
  dropoffTime: z.string().min(1, "Dropoff time is required"),
});

type CombinedFormData = z.infer<typeof combinedSchema>;

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
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted

  // Initialize react-hook-form for the combined form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CombinedFormData>({
    resolver: zodResolver(combinedSchema),
  });

  // Set isMounted to true after the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const onSubmit: SubmitHandler<CombinedFormData> = (data) => {
    const pickupDate = new Date(data.pickupDate);
    const dropoffDate = new Date(data.dropoffDate);

    // Additional validation: Pickup date must be before dropoff date
    if (pickupDate >= dropoffDate) {
      alert("Dropoff date must be after pickup date.");
      return;
    }

    console.log("Form Data:", data);
    // Handle payment submission (e.g., integrate with Stripe or PayPal)
    alert("Payment successful!");
  };

  // Render nothing until the component mounts
  if (!isMounted) {
    return null;
  }

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
            </form>
          </CardContent>
        </Card>

        {/* Rental Info */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Info</CardTitle>
            <CardDescription className="flex justify-between">
              <span>Please select your rental date</span>
              <span>Step 2 of 4</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image src="/Pick - Up (1).png" alt="Pick Up" width={92} height={20} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-bold">Location</label>
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
                  <div className="space-y-2">
                    <label className="font-bold">Date</label>
                    <Input
                      type="date"
                      {...register("pickupDate")}
                      className="bg-[#f6f7f9] h-14 rounded-xl"
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm">{errors.pickupDate.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Time</label>
                  <Input
                    type="time"
                    {...register("pickupTime")}
                    className="bg-[#f6f7f9] h-14 rounded-xl"
                  />
                  {errors.pickupTime && (
                    <p className="text-red-500 text-sm">{errors.pickupTime.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image src="/Drop - Off (1).png" alt="Drop Off" width={104} height={20} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-bold">Location</label>
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
                  <div className="space-y-2">
                    <label className="font-bold">Date</label>
                    <Input
                      type="date"
                      {...register("dropoffDate")}
                      className="bg-[#f6f7f9] h-14 rounded-xl"
                    />
                    {errors.dropoffDate && (
                      <p className="text-red-500 text-sm">{errors.dropoffDate.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-bold">Time</label>
                  <Input
                    type="time"
                    {...register("dropoffTime")}
                    className="bg-[#f6f7f9] h-14 rounded-xl"
                  />
                  {errors.dropoffTime && (
                    <p className="text-red-500 text-sm">{errors.dropoffTime.message}</p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payment Method */}
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

        {/* Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription className="flex justify-between">
              <span>We are getting to the end. Just a few clicks and your rental is ready</span>
              <span>Step 4 of 4</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleSubmit(onSubmit)} className="w-full h-14 bg-[#3563e9]">
              Rent Now
            </Button>
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