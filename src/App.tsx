import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, RefreshCw } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (text) {
      generateQR();
    }
  }, [text]);

  const generateQR = async () => {
    try {
      setIsGenerating(true);
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQR = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      alert('QR Code copied to clipboard!');
    } catch (err) {
      console.error('Error copying QR code:', err);
      alert('Failed to copy QR Code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <QrCode className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">QR Code Generator</h1>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text or URL
            </label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter text to generate QR code..."
            />
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
            {qrUrl ? (
              <div className="relative group">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-center">
                  Enter text above to generate QR code
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {qrUrl && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={copyQR}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;