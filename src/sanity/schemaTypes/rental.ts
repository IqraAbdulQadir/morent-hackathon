export default {
  name: "rental",
  type: "document",
  title: "Rental",
  fields: [
    {
      name: "car",
      type: "reference",
      to: [{ type: "car" }],
      title: "Car",
      description: "The car being rented",
    },
    {
      name: "customer",
      type: "reference",
      to: [{ type: "customer" }],
      title: "Customer",
      description: "The customer renting the car",
    },
    {
      name: 'userId',
      type: 'string',
      title: 'User ID',
      description: 'ID of the authenticated user',
    },
    {
      name: "startDate",
      type: "datetime",
      title: "Start Date",
      
    },
    {
      name: "endDate",
      type: "datetime",
      title: "End Date",
      
    },
    {
      name: "duration",
      type: "number",
      title: "Duration (in days)",
      description: "The total number of rental days",
      
    },
    {
      name: "deposit",
      type: "number",
      title: "Deposit",
      description: "The refundable deposit for the rental",
      
    },
    {
      name: "totalPrice",
      type: "number",
      title: "Total Price",
      description: "Total cost for the rental period",
      
    },
    {
      name: "conditionReport",
      type: "object",
      title: "Condition Report",
      fields: [
        {
          name: "beforeRental",
          type: "text",
          title: "Before Rental",
          description: "Condition of the car before rental",
        },
        {
          name: "afterRental",
          type: "text",
          title: "After Rental",
          description: "Condition of the car after rental",
        },
        {
          name: "beforePhotos",
          type: "array",
          title: "Before Rental Photos",
          of: [{ type: "image" }],
          description: "Photos of the car before rental",
        },
        {
          name: "afterPhotos",
          type: "array",
          title: "After Rental Photos",
          of: [{ type: "image" }],
          description: "Photos of the car after rental",
        },
      ],
    },
    {
      name: "status",
      type: "string",
      title: "Rental Status",
      options: {
        list: ["Pending", "Ongoing", "Completed", "Cancelled"],
      },
      initialValue: "Pending",
    },
    {
      name: "paymentStatus",
      type: "string",
      title: "Payment Status",
      options: {
        list: ["Paid", "Unpaid", "Partially Paid"],
      },
      initialValue: "Unpaid",
    },
  ],
};