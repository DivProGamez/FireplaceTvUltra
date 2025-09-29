"use client";

import React, { useRef, useEffect } from "react";

export const RainCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const raindrops: any[] = [];
    const raindropCount = 500;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    class Raindrop {
        x: number;
        y: number;
        length: number;
        speedY: number;

        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.length = Math.random() * 20 + 10;
            this.speedY = Math.random() * 10 + 5;
        }
        update() {
            this.y += this.speedY;
            if (this.y > canvas.height) {
                this.y = 0 - this.length;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            if (!ctx) return;
            ctx.strokeStyle = "rgba(173, 216, 230, 0.5)"; // Light blue
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        }
    }

    const init = () => {
        for (let i = 0; i < raindropCount; i++) {
            raindrops.push(new Raindrop());
        }
    }
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      raindrops.forEach(r => {
        r.update();
        r.draw();
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
