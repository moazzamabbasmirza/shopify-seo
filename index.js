const axios = require('axios');
require('dotenv').config();

const { SHOPIFY_ACCESS_TOKEN, SHOPIFY_STORE_NAME } = process.env;

const shopifyURL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2021-04`;

async function updateMetaTags(productId, title, description, keywords) {
  try {
    const metafieldsResponse = await axios.get(`${shopifyURL}/products/${productId}/metafields.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    const existingMetafields = metafieldsResponse.data.metafields;

    const metafieldsToUpdate = [
        {
          namespace: 'seo',
          key: 'title_tag',
          value: title,
          type: 'string'
        },
        {
          namespace: 'seo',
          key: 'description_tag',
          value: description,
          type: 'string'
        },
        {
          namespace: 'seo',
          key: 'keywords_tag',
          value: keywords,
          type: 'string'
        }
      ];
      

    for (const metafield of metafieldsToUpdate) {
      const existingMetafield = existingMetafields.find(
        (mf) => mf.namespace === metafield.namespace && mf.key === metafield.key
      );

      if (existingMetafield) {
        await axios.put(`${shopifyURL}/metafields/${existingMetafield.id}.json`, {
          metafield: {
            id: existingMetafield.id,
            value: metafield.value
          }
        }, {
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post(`${shopifyURL}/metafields.json`, {
          metafield: {
            ...metafield,
            owner_id: productId,
            owner_resource: 'product'
          }
        }, {
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          }
        });
      }
    }

    console.log(`Product ${productId} meta tags updated successfully`);
  } catch (error) {
    console.error(`Failed to update product ${productId} meta tags`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    }
  }
}

(async () => {
  const productId = 9047377248596;
  const title = "Bogist C1 Pro 13ah Battery";
  const description = "Bogist C1 Pro 13ah Battery";
  const keywords = "Bogist C1 Pro Battery, Bogist C1 scooter battery 13ah, Bogist replacement Battery, 54.6v 13ah 15ah 20ah scooter battery, rechargeable bogist battery, bogist high quality litihum iom battery";

  await updateMetaTags(productId, title, description, keywords);
})();
