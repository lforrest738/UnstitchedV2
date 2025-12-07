import React from 'react';
import { NEWS_ARTICLES, COLORS } from '../constants';
import { Heart } from 'lucide-react';

const News: React.FC<{ isAccessMode: boolean }> = ({ isAccessMode }) => {
  const themeText = isAccessMode ? 'text-black' : 'text-[#264653]';
  
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${themeText}`}>Unstitched News</h2>
        <p className="text-[#E76F51] italic font-bold mt-1">"Scan the label, stop the labour."</p>
      </div>

      {NEWS_ARTICLES.map((article, index) => (
        <div 
          key={index} 
          className="bg-white p-5 rounded-2xl shadow-sm border-l-4"
          style={{ borderLeftColor: COLORS.coral }}
        >
          <h3 className="text-[#E76F51] font-bold text-xl mb-1">{article.stat}</h3>
          <h4 className={`font-bold mb-2 ${themeText}`}>{article.title}</h4>
          <p className={`text-sm mb-3 ${isAccessMode ? 'text-black' : 'text-gray-600'}`}>{article.content}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Source: {article.source}</p>
        </div>
      ))}

      <div className="bg-[#FFEEDB] p-6 rounded-2xl text-center mt-4">
        <h3 className="text-[#E76F51] font-bold text-lg mb-2">Make a Difference</h3>
        <p className="text-sm text-[#264653] mb-4">Donations go to Unseen, Hope for Justice, and Save the Children.</p>
        
        <div className="flex justify-center gap-3">
          {[2, 5, 10].map(amount => (
            <button 
              key={amount}
              className="bg-[#E76F51] text-white px-4 py-2 rounded-full font-bold shadow-sm active:scale-95 flex items-center gap-1"
              onClick={() => alert(`Thank you for your £${amount} donation!`)}
            >
              <Heart size={14} fill="currentColor" /> £{amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;