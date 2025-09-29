"use client";

import React, { useRef, useEffect } from "react";

export const FireplaceCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: any[] = [];
    const particleCount = 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 5 + 1;
        this.speedY = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 30 + 10}, 100%, 50%)`;
        this.life = 0;
        this.maxLife = Math.random() * 100 + 50;
      }
      update() {
        this.y -= this.speedY;
        this.life++;
        if (this.life >= this.maxLife) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.life = 0;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - (this.life / this.maxLife);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const init = () => {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
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
