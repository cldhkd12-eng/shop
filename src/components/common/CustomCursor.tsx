import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

export const CustomCursor: React.FC = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Hide native cursor globally
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = () => setClicked(true);
    const onUp   = () => setClicked(false);
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive =
        t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'INPUT' ||
        !!t.closest('button') || !!t.closest('a') || !!t.closest('[role="button"]') ||
        getComputedStyle(t).cursor === 'pointer';
      setHovered(isInteractive);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('mouseover', onOver, { passive: true });

    // Smooth ring follow with RAF
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, posRef.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, posRef.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.left = `${posRef.current.x}px`;
        dotRef.current.style.top  = `${posRef.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top  = `${ringPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <CursorDot
        ref={dotRef}
        className={`${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''}`}
      />
      <CursorRing
        ref={ringRef}
        className={`${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''}`}
      />
    </>
  );
};

/* ─── Keyframes ─── */
const breathe = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%       { transform: translate(-50%, -50%) scale(1.15); }
`;

/* ─── Dot (snaps instantly to cursor) ─── */
const CursorDot = styled.div`
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: difference;
  transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;

  &.hovered {
    width: 12px;
    height: 12px;
    background: #fff;
  }
  &.clicked {
    width: 5px;
    height: 5px;
  }

  @media (max-width: 768px) { display: none; }
`;

/* ─── Ring (lazy-follows with lerp) ─── */
const CursorRing = styled.div`
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 99998;
  mix-blend-mode: difference;
  transition: width 0.25s cubic-bezier(.25,.46,.45,.94),
              height 0.25s cubic-bezier(.25,.46,.45,.94),
              border-color 0.25s ease,
              background 0.25s ease;

  &.hovered {
    width: 60px;
    height: 60px;
    border-color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.1);
    animation: ${breathe} 1.5s ease-in-out infinite;
  }
  &.clicked {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) { display: none; }
`;
