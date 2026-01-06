
import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isActive: boolean;
  isModelSpeaking: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ isActive, isModelSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      
      const barCount = 40;
      const barWidth = width / barCount;
      const centerY = height / 2;

      ctx.fillStyle = isModelSpeaking ? '#3b82f6' : '#10b981';

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const noise = Math.sin(offset + i * 0.2) * 20;
        const amplitude = isActive ? (Math.random() * 30 + 10) : 2;
        const barHeight = amplitude + noise;
        
        ctx.beginPath();
        ctx.roundRect(x + 2, centerY - barHeight / 2, barWidth - 4, barHeight, 4);
        ctx.fill();
      }

      offset += 0.1;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, isModelSpeaking]);

  return (
    <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={128} 
        className="max-w-full"
      />
      {!isActive && (
        <span className="absolute text-gray-400 font-medium">Click Start to Speak</span>
      )}
    </div>
  );
};

export default Visualizer;
