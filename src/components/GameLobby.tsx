import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Gamepad2, Users, Monitor, Tv2, MessageSquare, Phone } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  ready: boolean;
}

const GameLobby: React.FC = () => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSMSSuccess, setShowSMSSuccess] = useState(false);
  const lobbyCode = "GAME123"; // In production, this would be generated

  const connectionUrl = `${window.location.origin}/controller/${lobbyCode}`;

  const handleSendSMS = async () => {
    try {
      // In production, this would call your backend API to send SMS via Twilio
      console.log('Sending SMS to:', phoneNumber);
      setShowSMSSuccess(true);
      setTimeout(() => setShowSMSSuccess(false), 3000);
      setPhoneNumber('');
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Tv2 className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Modal.tv
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span className="text-xl">{players.length}/4 Players</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Monitor className="w-6 h-6 text-purple-400" />
              Join the Experience
            </h2>
            <div className="flex flex-col items-center">
              <QRCodeSVG 
                value={connectionUrl}
                size={200}
                level="H"
                className="mb-4"
                bgColor="transparent"
                fgColor="white"
              />
              <p className="text-lg font-semibold mb-2">Scan to Join</p>
              
              <div className="w-full mt-6 space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg py-2 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleSendSMS}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  Send Link via SMS
                </button>
                {showSMSSuccess && (
                  <div className="text-green-400 text-sm text-center">
                    SMS sent successfully!
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">or use code:</p>
                <div className="bg-white/5 border border-purple-500/30 px-4 py-2 rounded-lg mt-2">
                  <code className="text-xl tracking-wider text-purple-300">{lobbyCode}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-semibold mb-6">Connected Players</h2>
            {players.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50 text-purple-400" />
                <p>Waiting for players to join...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {players.map((player) => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-purple-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        {player.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      player.ready ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {player.ready ? 'Ready' : 'Not Ready'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          className={`mt-8 w-full py-4 rounded-xl text-xl font-semibold transition-all duration-300 ${
            players.length > 0 && players.every(p => p.ready)
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-500/50 cursor-not-allowed'
          }`}
          disabled={players.length === 0 || !players.every(p => p.ready)}
        >
          Start Experience
        </button>
      </div>
    </div>
  );
};

export default GameLobby;