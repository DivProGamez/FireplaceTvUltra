"use client";

import React, { useRef, useEffect } from "react";

export const AquariumCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const bubbles: any[] = [];
    const bubbleCount = 50;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    
    class Bubble {
        x: number;
        y: number;
        radius: number;
        speedY: number;

        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.radius = Math.random() * 5 + 2;
            this.speedY = Math.random() * 2 + 1;
        }
        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y / 50) * 0.5; // Wobble
            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            if (!ctx) return;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    const init = () => {
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push(new Bubble());
        }
    }
    init();

    const animate = () => {
      // Create a subtle blue gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a2a6c');
      gradient.addColorStop(1, '#005f73');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach(b => {
        b.update();
        b.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
