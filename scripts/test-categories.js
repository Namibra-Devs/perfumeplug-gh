// scripts/test-categories.js
// Simple script to test category extraction from the API

const TENANT_DOMAIN = process.env.VITE_TENANT_DOMAIN || 'https://perfume-plug.com';

async function testCategoryExtraction() {
  try {
    console.log('Testing category extraction...');
    
    // Test with different limits to see the difference
    const limits = [20, 100, 500, 1000, 10000];
    
    for (const limit of limits) {
      console.log(`\n--- Testing with limit: ${limit} ---`);
      
      const response = await fetch(`${TENANT_DOMAIN}/api/ecommerce/products?limit=${limit}&page=1`, {
        headers: {
          'X-Frontend-Domain': 'www.perfume-plug.com'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.products) {
        const products = data.data.products;
        const categoryMap = new Map();
        
        products.forEach(product => {
          if (product.category) {
            const cat = product.category.toLowerCase();
            categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
          }
        });
        
        console.log(`Products fetched: ${products.length}`);
        console.log(`Unique categories: ${categoryMap.size}`);
        console.log(`Categories found:`, Array.from(categoryMap.keys()));
        console.log(`Category counts:`, Object.fromEntries(categoryMap));
      } else {
        console.log('Failed to fetch products:', data);
      }
    }
    
  } catch (error) {
    console.error('Error testing categories:', error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testCategoryExtraction();
}

module.exports = { testCategoryExtraction };