const db = require('./database');

const seedProducts = [
  {
    name: 'Laptop',
    description: 'High-performance laptop for all your computing needs',
    price: 999.99,
    image_url: 'https://www.bhphotovideo.com/images/images2500x2500/asus_1015e_ds01_10_1_notebook_computer_943487.jpg',
    stock: 10
  },
  {
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    price: 699.99,
    image_url: 'https://purepng.com/public/uploads/large/purepng.com-android-smartphonepersonal-computersmartphonemobile-operating-systemcellular-phoneandroid-17015283912796apux.png',
    stock: 15
  },
  {
    name: 'Headphones',
    description: 'Wireless noise-canceling headphones',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 20
  }
];

// Insert seed data
const insertProducts = () => {
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, image_url, stock)
    VALUES (?, ?, ?, ?, ?)
  `);

  seedProducts.forEach(product => {
    stmt.run([
      product.name,
      product.description,
      product.price,
      product.image_url,
      product.stock
    ]);
  });

  stmt.finalize();
  console.log('Products seeded successfully');
};

// Run the seed
insertProducts(); 