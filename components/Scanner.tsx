import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { analyzeLabelImage, calculateEthicalScore } from '../services/geminiService';
import { UserState, ScanResult } from '../types';
import { COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ScannerProps {
  userState: UserState;
  onScanComplete: (result: ScanResult) => void;
  isAccessMode: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ userState, onScanComplete, isAccessMode }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeColors = isAccessMode
    ? { text: 'text-black', bg: 'bg-white', border: 'border-black' }
    : { text: 'text-[#264653]', bg: 'bg-white', border: 'border-[#2A9D8F]' };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (userState.role === 'Guest' && userState.guestScans >= 10) {
      setError("You've used your 10 free scans! Please sign up.");
      return;
    }

    setError(null);
    setLastResult(null);
    setIsScanning(true);

    // Create Preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      
      try {
        // Strip prefix for API
        const base64Data = base64String.split(',')[1];
        const analysis = await analyzeLabelImage(base64Data);
        
        const riskScore = calculateEthicalScore(analysis.brand, analysis.material, analysis.origin);
        
        const result: ScanResult = {
          brand: analysis.brand,
          material: analysis.material,
          origin: analysis.origin,
          risk: riskScore,
          date: new Date().toISOString()
        };

        setLastResult(result);
        onScanComplete(result);
      } catch (err: any) {
        setError(err.message || "Failed to analyze image. Please try again.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const renderRiskChart = (risk: number) => {
    const data = [
      { name: 'Risk', value: risk },
      { name: 'Safety', value: 100 - risk },
    ];
    const chartColors = [COLORS.coral, COLORS.teal];

    return (
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className={`text-center font-bold text-xl ${isScanning ? 'opacity-50' : ''}`} style={{ color: risk > 50 ? COLORS.coral : COLORS.teal }}>
          {risk}% Risk
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${isAccessMode ? 'text-black' : 'text-[#264653]'}`}>
          Behind the Label
        </h2>
        <p className={`text-sm ${isAccessMode ? 'text-gray-800' : 'text-gray-600'}`}>
          Identify materials, brands, and supply chain risks instantly.
        </p>
      </div>

      <div className={`p-6 rounded-2xl shadow-lg ${themeColors.bg} border-l-4 ${themeColors.border}`}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {!preview && !isScanning && !lastResult && (
          <div className="flex flex-col gap-4">
             <button
              onClick={triggerCamera}
              className={`flex items-center justify-center gap-3 py-4 rounded-full font-bold text-white shadow-md transition-transform active:scale-95`}
              style={{ backgroundColor: COLORS.teal }}
            >
              <Camera size={24} />
              Scan Label
            </button>
            <button
              onClick={triggerCamera} // Re-use input for simplicity, creates prompt on mobile
              className={`flex items-center justify-center gap-3 py-4 rounded-full font-bold border-2 transition-transform active:scale-95`}
              style={{ borderColor: COLORS.teal, color: COLORS.teal }}
            >
              <Upload size={24} />
              Upload Photo
            </button>
          </div>
        )}

        {preview && (
          <div className="flex flex-col items-center gap-4">
            <img src={preview} alt="Label Preview" className="w-48 h-48 object-cover rounded-lg shadow-sm" />
            
            {isScanning && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-[#2A9D8F]" size={32} />
                <p className="text-sm font-medium">Analyzing supply chain...</p>
              </div>
            )}
            
            {!isScanning && lastResult && (
              <button 
                onClick={() => {
                  setPreview(null);
                  setLastResult(null);
                }}
                className="text-sm underline text-gray-500"
              >
                Scan Another
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertTriangle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {lastResult && !isScanning && (
        <div className={`p-5 rounded-2xl shadow-lg ${themeColors.bg} animate-in slide-in-from-bottom-5 duration-500`}>
          <h3 className={`font-bold text-lg mb-4 ${themeColors.text} flex items-center gap-2`}>
            <CheckCircle size={20} className="text-[#2A9D8F]" /> Analysis Results
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-1">
              <p className="text-xs text-gray-500 uppercase">Brand</p>
              <p className="font-semibold">{lastResult.brand}</p>
            </div>
            <div className="col-span-1">
              <p className="text-xs text-gray-500 uppercase">Origin</p>
              <p className="font-semibold">{lastResult.origin}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase">Material</p>
              <p className="font-semibold">{lastResult.material}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
             <div className="w-1/2">
                {renderRiskChart(lastResult.risk)}
             </div>
             <div className="w-1/2 pl-4">
                {lastResult.risk > 60 ? (
                  <div className="text-sm">
                     <p className="font-bold text-[#E76F51] mb-1">High Risk</p>
                     <p className="text-xs leading-tight">This item likely has supply chain issues. Consider alternatives.</p>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="font-bold text-[#2A9D8F] mb-1">Lower Risk</p>
                    <p className="text-xs leading-tight">This item appears to have a cleaner supply chain.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;