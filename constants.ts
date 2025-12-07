import { MarketplaceItem, NewsArticle } from './types';

export const COLORS = {
  deepGreen: '#264653',
  teal: '#2A9D8F',
  coral: '#E76F51',
  cream: '#FFEEDB',
  white: '#FFFFFF',
  black: '#000000',
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    title: "The True Cost of Fast Fashion",
    content: "Every year, tens of millions of children are forced to make clothes for major brands. They are often paid little to no money.",
    stat: "138 Million Children Affected",
    source: "Unstitched Research"
  },
  {
    title: "Safety in the Workplace",
    content: "Terrible working conditions lead to injuries. Unstitched works to reduce these numbers and give children the right to education and play.",
    stat: "106.4 Million Injured Yearly",
    source: "Global Labor Stats"
  }
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { id: 1, title: "Vintage Denim Jacket", price: 45.00, seller: "SarahSews", image: "https://picsum.photos/300/300?random=1", rating: "A", desc: "Saved from landfill!", category: "Outerwear", style: "Vintage", material: "Denim" },
  { id: 2, title: "Organic Cotton Tee", price: 15.00, seller: "GreenGuy", image: "https://picsum.photos/300/300?random=2", rating: "A+", desc: "Hand-painted design.", category: "Tops", style: "Casual", material: "Cotton" },
  { id: 3, title: "Chunky Knit Sweater", price: 28.00, seller: "RetroFit", image: "https://picsum.photos/300/300?random=3", rating: "B", desc: "100% Wool.", category: "Tops", style: "Vintage", material: "Wool" },
  { id: 4, title: "Hemp Cargo Pants", price: 30.00, seller: "EcoWarrior", image: "https://picsum.photos/300/300?random=4", rating: "A", desc: "Super durable.", category: "Bottoms", style: "Streetwear", "material": "Hemp" },
  { id: 5, title: "Floral Summer Dress", price: 35.00, seller: "LizzieLoops", image: "https://picsum.photos/300/300?random=5", rating: "A", desc: "Upcycled fabric.", category: "Dresses", style: "Chic", "material": "Viscose" },
  { id: 6, title: "Retro Windbreaker", price: 40.00, seller: "OldSchoolCool", image: "https://picsum.photos/300/300?random=6", rating: "B+", desc: "90s Original.", category: "Outerwear", style: "Streetwear", "material": "Polyester" },
  { id: 7, title: "Linen Trousers", price: 55.00, seller: "PureThreads", image: "https://picsum.photos/300/300?random=7", rating: "A++", desc: "Biodegradable.", category: "Bottoms", style: "Minimalist", "material": "Linen" },
  { id: 8, title: "Bucket Hat", price: 12.00, seller: "HatTrick", image: "https://picsum.photos/300/300?random=8", rating: "A", desc: "Handmade.", category: "Accessories", "style": "Streetwear", "material": "Cotton" },
  { id: 9, title: "Silk Scarf", price: 20.00, seller: "SilkySmooth", image: "https://picsum.photos/300/300?random=9", rating: "A", desc: "Natural dyes.", category: "Accessories", "style": "Chic", "material": "Silk" },
  { id: 10, title: "Patchwork Hoodie", price: 60.00, seller: "ReStitch", image: "https://picsum.photos/300/300?random=10", rating: "A+", desc: "Zero waste.", category: "Tops", "style": "Streetwear", "material": "Cotton" },
];

export const STYLE_OPTIONS = ["Vintage", "Streetwear", "Minimalist", "Chic", "Casual", "Boho"];