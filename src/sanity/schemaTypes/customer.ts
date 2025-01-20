export default {
    name: 'customer',
    type: 'document',
    title: 'Customer',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Name',
        
      },
      {
        name: 'email',
        type: 'string',
        title: 'Email',
        
      },
      {
        name: 'phone',
        type: 'string',
        title: 'Phone Number',
        
      },
      {
        name: 'address',
        type: 'text',
        title: 'Address',
        description: 'Customer’s delivery address',
      },
    ],
  };