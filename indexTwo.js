const axios = require('axios');
require('dotenv').config();

const { SHOPIFY_ACCESS_TOKEN, SHOPIFY_STORE_NAME } = process.env;

const shopifyURL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-04/products.json`;

async function fetchProductIds() {
  try {
    const response = await axios.get(shopifyURL, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const products = response.data.products;

    products.forEach(product => {
      console.log(`Product ID: ${product.id}, Title: ${product.title}`);
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

fetchProductIds();
