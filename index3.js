const axios = require('axios');
require('dotenv').config();

const { SHOPIFY_ACCESS_TOKEN, SHOPIFY_STORE_NAME } = process.env;

const shopifyURL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-04`;

async function fetchProductMetafields(productId) {
  try {
    const response = await axios.get(`${shopifyURL}/products/${productId}/metafields.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const metafields = response.data.metafields;

    console.log(`Metafields for product ${productId}:`, metafields);
  } catch (error) {
    console.error(`Error fetching metafields for product ${productId}:`, error.message);
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

(async () => {
  const productId = 9020508733780; // Replace with your actual product ID
  await fetchProductMetafields(productId);
})();
