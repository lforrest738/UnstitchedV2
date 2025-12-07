import React, { useState, useEffect } from 'react';
import { UserState, ScanResult, UserRole } from './types';
import { COLORS } from './constants';
import Scanner from './components/Scanner';
import Shop from './components/Shop';
import News from './components/News';
import { Camera, ShoppingBag, Newspaper, Clipboard, User, Lock, Eye, EyeOff } from 'lucide-react';

// --- Sub-components for simpler file structure ---

const Onboarding = ({ onJoin, onGuest }: { onJoin: (data: any) => void, onGuest: () => void }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'new'>('signin');
  const [styles, setStyles] = useState<string[]>([]);
  
  const styleOptions = ["Vintage", "Streetwear", "Minimalist", "Chic", "Casual", "Boho"];

  const toggleStyle = (style: string) => {
    setStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  return (
    <div className="min-h-screen bg-[#FFEEDB] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">🧵</div>
      <h1 className="text-4xl font-bold text-[#264653] mb-2 tracking-tight">UNSTITCHED</h1>
      <h3 className="text-xl text-[#E76F51] font-medium italic mb-8">Scan the label,<br/>stop the labour.</h3>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`flex-1 py-4 font-bold text-sm ${activeTab === 'signin' ? 'text-[#2A9D8F] border-b-2 border-[#2A9D8F]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button 
             className={`flex-1 py-4 font-bold text-sm ${activeTab === 'new' ? 'text-[#2A9D8F] border-b-2 border-[#2A9D8F]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('new')}
          >
            New Account
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'signin' ? (
            <div className="flex flex-col gap-4">
              <input type="email" placeholder="Email" className="w-full p-3 bg-gray-50 rounded-xl border focus:outline-none focus:border-[#2A9D8F]" />
              <input type="password" placeholder="Password" className="w-full p-3 bg-gray-50 rounded-xl border focus:outline-none focus:border-[#2A9D8F]" />
              <button 
                onClick={() => onJoin({ role: 'User', styles: ['Vintage', 'Casual'] })}
                className="w-full py-3 bg-[#2A9D8F] text-white font-bold rounded-full mt-2 shadow-lg active:scale-95 transition-transform"
              >
                Sign In
              </button>
            </div>
          ) : (
             <div className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="w-full p-3 bg-gray-50 rounded-xl border focus:outline-none focus:border-[#2A9D8F]" />
              
              <div className="text-left">
                <label className="text-xs font-bold text-gray-500 ml-1">Your Style (Select multiple)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {styleOptions.map(style => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`text-xs px-3 py-1 rounded-full border ${styles.includes(style) ? 'bg-[#264653] text-white border-[#264653]' : 'bg-white text-gray-600 border-gray-300'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onJoin({ role: 'User', styles: styles })}
                className="w-full py-3 bg-[#2A9D8F] text-white font-bold rounded-full mt-4 shadow-lg active:scale-95 transition-transform"
              >
                Join the Movement
              </button>
            </div>
          )}
        </div>
      </div>

      <button onClick={onGuest} className="mt-8 text-gray-500 font-medium underline text-sm">
        Continue as Guest
      </button>
    </div>
  );
};

const Board = ({ userState }: { userState: UserState }) => (
  <div className="flex flex-col gap-6 text-center">
    <h2 className="text-2xl font-bold text-[#264653]">Community Board</h2>
    {userState.subscription !== 'Needles' ? (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center gap-4">
        <Lock className="text-[#E76F51]" size={48} />
        <h3 className="font-bold text-lg text-[#E76F51]">Subscribers Only</h3>
        <p className="text-gray-600 text-sm">Join 'Needles' to access community challenges and voting.</p>
        <div className="w-full h-32 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    ) : (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-[#264653] mb-4">Weekly Upcycling Competition</h3>
        <p className="mb-4 text-sm">Theme: <strong>Denim Transformation</strong></p>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-gray-200 h-32 rounded-lg flex items-center justify-center text-xs text-gray-500">Before</div>
          <div className="flex-1 bg-gray-200 h-32 rounded-lg flex items-center justify-center text-xs text-gray-500">After</div>
        </div>
        <button className="text-[#E76F51] font-bold border border-[#E76F51] px-4 py-2 rounded-full w-full">
          Vote for EcoWarrior99 ❤️
        </button>
      </div>
    )}
  </div>
);

const Profile = ({ userState, onLogout, onUpgrade }: any) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-2xl font-bold text-[#264653]">My Profile</h2>
    
    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#2A9D8F]">
      <h3 className="text-gray-500 text-xs uppercase tracking-wide font-bold mb-1">Your Impact</h3>
      <div className="flex items-end gap-2">
         <span className="text-4xl font-bold text-[#264653]">
           {userState.scanHistory.filter((s: ScanResult) => s.risk < 40).length}
         </span>
         <span className="text-gray-400 mb-1 font-medium">ethical choices made</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">{userState.scanHistory.length} total scans</p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold text-[#264653] mb-2">Subscription</h3>
      {userState.subscription === 'Free' ? (
        <>
          <p className="text-gray-600 mb-4">Current Plan: <strong>Free</strong></p>
          <button 
            onClick={onUpgrade}
            className="w-full py-3 bg-[#E76F51] text-white font-bold rounded-full shadow-md active:scale-95"
          >
            Upgrade to Needles (£4.99/mo)
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2 text-[#2A9D8F]">
          <Clipboard size={20} />
          <span className="font-bold">You are a Needles Member! 🪡</span>
        </div>
      )}
    </div>

    <div className="mt-auto">
      <button onClick={onLogout} className="w-full py-3 text-gray-400 font-medium">Log Out</button>
      <p className="text-center text-xs text-gray-300 mt-4">Unstitched v1.0.0</p>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>({
    role: null,
    subscription: 'Free',
    accessibilityMode: false,
    scanHistory: [],
    styles: [],
    guestScans: 0
  });

  const [activeTab, setActiveTab] = useState<'scan' | 'shop' | 'news' | 'board' | 'me'>('scan');

  const handleScanComplete = (result: ScanResult) => {
    setUserState(prev => ({
      ...prev,
      scanHistory: [...prev.scanHistory, result],
      guestScans: prev.role === 'Guest' ? prev.guestScans + 1 : prev.guestScans
    }));
  };

  const toggleAccessMode = () => {
    setUserState(prev => ({ ...prev, accessibilityMode: !prev.accessibilityMode }));
  };

  // Background color based on mode
  const appBg = userState.accessibilityMode ? 'bg-gray-100' : 'bg-[#FFEEDB]';
  const navColor = userState.accessibilityMode ? 'text-black' : 'text-[#E76F51]';
  const navSelected = userState.accessibilityMode ? 'text-[#2A9D8F]' : 'text-[#264653]';

  if (!userState.role) {
    return <Onboarding 
      onJoin={(data) => setUserState(prev => ({ ...prev, ...data }))}
      onGuest={() => setUserState(prev => ({ ...prev, role: 'Guest' }))}
    />;
  }

  return (
    <div className={`min-h-screen ${appBg} flex flex-col font-sans transition-colors duration-300`}>
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-center">
        <h1 className={`font-bold ${userState.accessibilityMode ? 'text-black' : 'text-[#264653]'}`}>
          Hi, {userState.role === 'Guest' ? 'Guest' : 'Friend'}
        </h1>
        <button onClick={toggleAccessMode} className="p-2 rounded-full bg-white shadow-sm">
          {userState.accessibilityMode ? <Eye size={20} className="text-black"/> : <EyeOff size={20} className="text-gray-400"/>}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow px-6 pb-24 overflow-y-auto">
        {activeTab === 'scan' && (
          <Scanner 
            userState={userState} 
            onScanComplete={handleScanComplete} 
            isAccessMode={userState.accessibilityMode}
          />
        )}
        {activeTab === 'shop' && <Shop userState={userState} isAccessMode={userState.accessibilityMode} />}
        {activeTab === 'news' && <News isAccessMode={userState.accessibilityMode} />}
        {activeTab === 'board' && <Board userState={userState} />}
        {activeTab === 'me' && (
          <Profile 
            userState={userState} 
            onLogout={() => setUserState(prev => ({...prev, role: null}))}
            onUpgrade={() => setUserState(prev => ({...prev, subscription: 'Needles'}))}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 pb-safe">
        {[
          { id: 'scan', icon: Camera, label: 'Scan' },
          { id: 'shop', icon: ShoppingBag, label: 'Shop' },
          { id: 'news', icon: Newspaper, label: 'News' },
          { id: 'board', icon: Clipboard, label: 'Board' },
          { id: 'me', icon: User, label: 'Me' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? navSelected : 'text-gray-300'}`}
          >
            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;