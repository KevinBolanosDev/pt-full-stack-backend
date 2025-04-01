import { User } from '../models/users.model.js';

async function init() {
  try {
    console.log('Creating table...');
    await User.createTable();
    
    console.log('Seeding database...');
    await User.seedDatabase(10);  // Starting with 100000 users for testing
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

init();