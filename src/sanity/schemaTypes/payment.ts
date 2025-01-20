export default {
    name: 'payment',
    type: 'document',
    title: 'Payment',
    fields: [
      {
        name: 'rental',
        type: 'reference',
        to: [{ type: 'rental' }],
        title: 'Rental',
        description: 'The rental this payment is for',
       
      },
      {
        name: 'amount',
        type: 'number',
        title: 'Amount',
        description: 'The total amount paid',
        
      },
      {
        name: 'currency',
        type: 'string',
        title: 'Currency',
        description: 'The currency of the payment (e.g., USD)',
        initialValue: 'USD',
        
      },
      {
        name: 'paymentIntentId',
        type: 'string',
        title: 'Payment Intent ID',
        description: 'The Stripe Payment Intent ID',
        
      },
      {
        name: 'status',
        type: 'string',
        title: 'Payment Status',
        options: {
          list: ['Pending', 'Completed', 'Failed', 'Refunded'],
        },
        initialValue: 'Pending',
        
      },
      {
        name: 'paymentMethod',
        type: 'string',
        title: 'Payment Method',
        description: 'The payment method used (e.g., Credit Card, Stripe)',
      },
      {
        name: 'timestamp',
        type: 'datetime',
        title: 'Timestamp',
        description: 'The date and time of the payment',
        
      },
    ],
  };