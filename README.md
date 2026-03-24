# Card Scanner — Pokemon & Yu-Gi-Oh

Scan Pokemon and Yu-Gi-Oh trading cards to get live market prices. Upload or photograph a card and the app uses AI vision to identify it, then fetches real-time prices from public APIs.

## How It Works

1. **Upload or snap a photo** of your card
2. **AI identifies** the card name, set, and rarity using Claude vision (via Netlify AI Gateway)
3. **Prices are fetched** from free public APIs:
   - Pokemon: [Pokemon TCG API](https://pokemontcg.io/) (TCGPlayer market prices)
   - Yu-Gi-Oh: [YGOPRODeck API](https://ygoprodeck.com/api-guide/) (TCGPlayer, CardMarket, eBay, Amazon)

## Tech Stack

- Single-page HTML app (no build step)
- Netlify Functions + AI Gateway for secure server-side AI calls
- PWA-enabled: installable on mobile home screens
- Scan history stored locally in the browser

## Deployment

Deployed automatically on Netlify. The AI Gateway handles authentication — no API keys needed.
