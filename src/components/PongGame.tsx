import React, { useEffect, useRef, useState } from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameState {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1Y: number;
  paddle2Y: number;
  score1: number;
  score2: number;
}

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const PADDLE_SPEED = 8;

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    ballX: 400,
    ballY: 300,
    ballSpeedX: BALL_SPEED,
    ballSpeedY: BALL_SPEED,
    paddle1Y: 250,
    paddle2Y: 250,
    score1: 0,
    score2: 0
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const gameLoop = setInterval(() => {
      // Update paddle positions
      if (keys['w'] && gameState.paddle1Y > 0) {
        setGameState(prev => ({ ...prev, paddle1Y: prev.paddle1Y - PADDLE_SPEED }));
      }
      if (keys['s'] && gameState.paddle1Y < canvas.height - PADDLE_HEIGHT) {
        setGameState(prev => ({ ...prev, paddle1Y: prev.paddle1Y + PADDLE_SPEED }));
      }
      if (keys['ArrowUp'] && gameState.paddle2Y > 0) {
        setGameState(prev => ({ ...prev, paddle2Y: prev.paddle2Y - PADDLE_SPEED }));
      }
      if (keys['ArrowDown'] && gameState.paddle2Y < canvas.height - PADDLE_HEIGHT) {
        setGameState(prev => ({ ...prev, paddle2Y: prev.paddle2Y + PADDLE_SPEED }));
      }

      // Update ball position
      setGameState(prev => {
        let newState = { ...prev };
        newState.ballX += newState.ballSpeedX;
        newState.ballY += newState.ballSpeedY;

        // Ball collision with top and bottom walls
        if (newState.ballY <= 0 || newState.ballY >= canvas.height - BALL_SIZE) {
          newState.ballSpeedY = -newState.ballSpeedY;
        }

        // Ball collision with paddles
        if (
          (newState.ballX <= PADDLE_WIDTH && 
           newState.ballY >= newState.paddle1Y && 
           newState.ballY <= newState.paddle1Y + PADDLE_HEIGHT) ||
          (newState.ballX >= canvas.width - PADDLE_WIDTH - BALL_SIZE && 
           newState.ballY >= newState.paddle2Y && 
           newState.ballY <= newState.paddle2Y + PADDLE_HEIGHT)
        ) {
          newState.ballSpeedX = -newState.ballSpeedX;
        }

        // Score points
        if (newState.ballX <= 0) {
          newState.score2++;
          newState.ballX = canvas.width / 2;
          newState.ballY = canvas.height / 2;
        } else if (newState.ballX >= canvas.width) {
          newState.score1++;
          newState.ballX = canvas.width / 2;
          newState.ballY = canvas.height / 2;
        }

        return newState;
      });

      // Draw game
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw center line
      context.strokeStyle = '#333';
      context.setLineDash([5, 15]);
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.stroke();
      context.setLineDash([]);

      // Draw paddles
      context.fillStyle = '#fff';
      context.fillRect(0, gameState.paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      context.fillRect(
        canvas.width - PADDLE_WIDTH,
        gameState.paddle2Y,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );

      // Draw ball
      context.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);

      // Draw scores
      context.font = '48px "Press Start 2P", monospace';
      context.fillStyle = '#333';
      context.fillText(gameState.score1.toString(), canvas.width / 4, 60);
      context.fillText(gameState.score2.toString(), (3 * canvas.width) / 4, 60);

    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, keys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Modal.tv Pong
        </h1>
      </div>
      
      <div className="bg-black rounded-lg p-4 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-black rounded border-2 border-purple-500/20"
        />
      </div>

      <div className="mt-8 text-white text-center">
        <h2 className="text-xl mb-4">Controls</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-purple-400 mb-2">Player 1</h3>
            <p>W - Move Up</p>
            <p>S - Move Down</p>
          </div>
          <div>
            <h3 className="text-purple-400 mb-2">Player 2</h3>
            <p>↑ - Move Up</p>
            <p>↓ - Move Down</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PongGame;