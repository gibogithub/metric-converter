'use client';

import { useState } from 'react';
import { ConvertHandler, ConversionResult } from '../../lib/convertHandler';

const EXAMPLES = [
  { input: '10L', desc: '10 Liters to Gallons' },
  { input: '3.1mi', desc: '3.1 Miles to Kilometers' },
  { input: '1/2km', desc: 'Half Kilometer to Miles' },
  { input: '5.4/3lbs', desc: '5.4/3 Pounds to Kilograms' },
  { input: 'kg', desc: '1 Kilogram to Pounds (default)' },
  { input: 'gal', desc: '1 Gallon to Liters (default)' }
];

const CONVERSIONS = [
  { from: 'gal', to: 'L', desc: 'Gallons to Liters' },
  { from: 'L', to: 'gal', desc: 'Liters to Gallons' },
  { from: 'mi', to: 'km', desc: 'Miles to Kilometers' },
  { from: 'km', to: 'mi', desc: 'Kilometers to Miles' },
  { from: 'lbs', to: 'kg', desc: 'Pounds to Kilograms' },
  { from: 'kg', to: 'lbs', desc: 'Kilograms to Pounds' }
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ConversionResult[]>([]);
  const [showJson, setShowJson] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please enter a value');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Try server API first
      const response = await fetch(`/api/convert?input=${encodeURIComponent(input)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        const conversionResult = data as ConversionResult;
        setResult(conversionResult);
        setError(null);
        
        // Add to history (limit to 5)
        setHistory(prev => [conversionResult, ...prev.slice(0, 4)]);
      }
    } catch {
      // Fallback to client-side conversion
      const validation = ConvertHandler.processInput(input);
      
      if (typeof validation === 'string') {
        setError(validation);
        setResult(null);
      } else {
        setResult(validation);
        setError(null);
        setHistory(prev => [validation, ...prev.slice(0, 4)]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setTimeout(() => {
      const convertBtn = document.getElementById('convert-btn');
      if (convertBtn) convertBtn.click();
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            📏 Metric–Imperial Converter
          </h1>
          <p className="text-gray-600 text-lg">
            Convert between metric and imperial units with precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Converter */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="mb-8">
                <label className="block text-gray-700 text-sm font-bold mb-4">
                  Enter your conversion (e.g., 3.1mi, 1/2kg, 10L):
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter value with unit (e.g., 3.1mi)"
                    className="flex-grow px-6 py-4 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <button
                    id="convert-btn"
                    onClick={handleConvert}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Converting...
                      </span>
                    ) : 'Convert'}
                  </button>
                </div>
                
                {/* Quick Examples */}
                <div className="mt-6">
                  <p className="text-gray-600 text-sm mb-3">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLES.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(example.input)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        title={example.desc}
                      >
                        {example.input}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Display */}
              {error && (
                <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Success Card */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-2xl font-bold text-gray-800">Conversion Successful!</h3>
                      </div>
                    </div>
                    
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {result.string}
                      </div>
                      <div className="flex justify-center items-center space-x-8 mt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{result.initNum}</div>
                          <div className="text-sm text-gray-600 uppercase">{result.initUnit}</div>
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">{result.returnNum}</div>
                          <div className="text-sm text-gray-600 uppercase">{result.returnUnit}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JSON Toggle */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <button
                      onClick={() => setShowJson(!showJson)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="font-medium text-gray-700">View API Response</span>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${showJson ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showJson && (
                      <div className="mt-4">
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Conversion Table */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Supported Conversions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CONVERSIONS.map((conv, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-lg">{conv.from.toUpperCase()}</span>
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="font-bold text-lg">{conv.to.toUpperCase()}</span>
                        </div>
                        <span className="text-gray-600 text-sm">{conv.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - History & Info */}
          <div className="space-y-8">
            {/* History */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Conversions</h3>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Your conversion history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{item.string}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.initNum} {item.initUnit} → {item.returnNum} {item.returnUnit}
                          </div>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.initUnit}→{item.returnUnit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Rules */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Input Rules</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Whole numbers: <code className="bg-white px-2 py-1 rounded">10L</code></span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Decimals: <code className="bg-white px-2 py-1 rounded">3.1mi</code></span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Fractions: <code className="bg-white px-2 py-1 rounded">1/2kg</code></span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700">No double fractions: <code className="bg-white px-2 py-1 rounded">3/2/3kg</code></span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Default to 1 if no number: <code className="bg-white px-2 py-1 rounded">kg → 1kg</code></span>
                </div>
              </div>
            </div>

            {/* API Info */}
            <div className="bg-gray-50 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">API Usage</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Endpoint:</p>
                  <code className="block bg-gray-900 text-green-400 p-3 rounded-lg text-sm">
                    GET /api/convert?input=VALUE
                  </code>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Example:</p>
                  <code className="block bg-gray-900 text-blue-300 p-3 rounded-lg text-sm">
                    /api/convert?input=3.1mi
                  </code>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Response:</p>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
{`{
  "initNum": 3.1,
  "initUnit": "mi",
  "returnNum": 4.98895,
  "returnUnit": "km",
  "string": "3.1 miles converts to 4.98895 kilometers"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>FreeCodeCamp Certification Project</p>
          <p>Created By: Guilbert Paz</p>
          <p className="text-sm mt-2">All conversions rounded to 5 decimal places</p>
        </footer>
      </div>
    </main>
  );
}