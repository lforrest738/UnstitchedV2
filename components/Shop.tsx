import React, { useState } from 'react';
import { MARKETPLACE_ITEMS, COLORS } from '../constants';
import { MarketplaceItem, UserState } from '../types';
import { Search, ShoppingBag } from 'lucide-react';

interface ShopProps {
  userState: UserState;
  isAccessMode: boolean;
}

interface ItemCardProps {
  item: MarketplaceItem;
  themeText: string;
  cardBg: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, themeText, cardBg }) => (
  <div className={`rounded-xl overflow-hidden shadow-sm ${cardBg} flex flex-col`}>
    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
    <div className="p-3 flex flex-col flex-grow justify-between">
      <div>
        <h4 className={`font-bold text-sm truncate ${themeText}`}>{item.title}</h4>
        <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="font-bold text-[#E76F51]">£{item.price.toFixed(2)}</span>
        <span className="text-[10px] bg-[#2A9D8F] text-white px-2 py-1 rounded-full">{item.rating}</span>
      </div>
    </div>
  </div>
);

const Shop: React.FC<ShopProps> = ({ userState, isAccessMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Newest');

  const getRecommendations = (): MarketplaceItem[] => {
    // Simple logic: if user likes "Vintage", boost vintage items
    // Also check previous scans materials
    const scoredItems = MARKETPLACE_ITEMS.map(item => {
      let score = 0;
      if (userState.styles.includes(item.style)) score += 3;
      
      const scannedMaterials = userState.scanHistory.map(s => s.material.toLowerCase());
      if (scannedMaterials.some(m => item.material.toLowerCase().includes(m))) score += 2;
      
      return { item, score };
    });

    return scoredItems
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.item)
      .slice(0, 3);
  };

  const recommendations = getRecommendations();
  const displayRecs = recommendations.length > 0 ? recommendations : MARKETPLACE_ITEMS.slice(0, 3);

  const filteredItems = MARKETPLACE_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const themeText = isAccessMode ? 'text-black' : 'text-[#264653]';
  const cardBg = isAccessMode ? 'bg-white border-black border' : 'bg-white';

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${themeText}`}>Simple Shop</h2>
      </div>

      <div>
        <h3 className={`font-bold mb-3 ${themeText}`}>Selected For You</h3>
        <div className="grid grid-cols-3 gap-3">
          {displayRecs.map(item => (
            <ItemCard key={`rec-${item.id}`} item={item} themeText={themeText} cardBg={cardBg} />
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 my-2" />

      <div>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border rounded-lg px-2 bg-white"
          >
            <option>Newest</option>
            <option>Price: Low</option>
          </select>
        </div>

        <h3 className={`font-bold mb-3 ${themeText}`}>Browse All</h3>
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
             <div key={item.id} className="relative">
                <ItemCard item={item} themeText={themeText} cardBg={cardBg} />
                <button className="absolute bottom-2 right-2 p-1.5 bg-[#264653] rounded-full text-white shadow-md active:scale-95">
                  <ShoppingBag size={14} />
                </button>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;