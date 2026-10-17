import { useEffect, useRef, useCallback } from 'react';
import './landing.css';

// Las rutas apuntan al portal principal. Ajusta PORTAL_URL si el
// portal está desplegado en otra dirección (por defecto, relativo).
const PORTAL_URL = '';

const MENU_ITEMS = [
  { number: '01', label: 'Marco de trabajo', curve: 1, path: '/visualization' },
  { number: '02', label: 'Centro Documental', curve: 2, path: '#' },
  { number: '03', label: 'Aula Especializada', curve: 3, path: '#' },
  { number: '04', label: 'Metaverso', curve: 4, path: '#' },
  { number: '05', label: 'Mediaciones Sociotécnicas', curve: 5, path: '#' },
  { number: '06', label: 'Investigación-acción educativa', curve: 6, path: '#' },
  { number: '07', label: 'Casos de uso Didáctico', curve: 7, path: '#' },
  { number: '08', label: 'Autorregulación del Aprendizaje', curve: 8, path: '#' },
  { number: '09', label: 'Pensamiento Computacional', curve: 9, path: '#' },
];

class Particle {
  x = 0;
  y = 0;
  size = 0;
  speedX = 0;
  speedY = 0;
  opacity = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.opacity = Math.random() * 0.12 + 0.03;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(26, 26, 46, ${this.opacity})`;
    ctx.fill();
  }
}

class RippleParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  life = 1;
  decay: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.5 + 0.5;
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.size = Math.random() * 2.5 + 0.5;
    this.decay = Math.random() * 0.025 + 0.015;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.97;
    this.speedY *= 0.97;
    this.life -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(176, 176, 188, ${this.life * 0.5})`;
    ctx.fill();
  }
}

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mtrTextRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rippleParticlesRef = useRef<RippleParticle[]>([]);
  const trailParticlesRef = useRef<Array<{ x: number; y: number; size: number; life: number; decay: number }>>([]);
  const animationFrameRef = useRef<number>(0);

  const createRipple = useCallback((x: number, y: number) => {
    for (let i = 0; i < 20; i++) {
      rippleParticlesRef.current.push(new RippleParticle(x, y));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
    particlesRef.current = particles;

    const mainLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(26, 26, 46, ${0.02 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      rippleParticlesRef.current = rippleParticlesRef.current.filter((p) => p.life > 0);
      rippleParticlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      trailParticlesRef.current = trailParticlesRef.current.filter((p) => p.life > 0);
      trailParticlesRef.current.forEach((p) => {
        p.life -= p.decay;
        p.size *= 0.96;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 26, 46, ${p.life * 0.08})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(mainLoop);
    };
    mainLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mtrTextRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        mtrTextRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      const menuContainer = menuContainerRef.current;
      if (menuContainer) {
        const menuRect = menuContainer.getBoundingClientRect();
        if (
          e.clientX > menuRect.left &&
          e.clientX < menuRect.right &&
          e.clientY > menuRect.top &&
          e.clientY < menuRect.bottom
        ) {
          if (Math.random() > 0.75) {
            trailParticlesRef.current.push({
              x: e.clientX,
              y: e.clientY,
              size: Math.random() * 3 + 1,
              life: 1,
              decay: 0.04,
            });
          }
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        if (loaderRef.current) {
          loaderRef.current.classList.add('hidden');
        }
      }, 1000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);

    if (path !== '#') {
      setTimeout(() => {
        window.location.href = `${PORTAL_URL}${path}`;
      }, 300);
    }
  };

  return (
    <div className="landing-page">
      <div className="loader" ref={loaderRef}>
        <div className="loader-text">MTr</div>
      </div>

      <canvas ref={canvasRef} id="particleCanvas" />

      <div className="container">
        <div className="left-section">
          <div className="mtr-text" ref={mtrTextRef}>
            <span className="m">M</span>
            <span className="t">T</span>
            <span className="r">r</span>
          </div>
          <div className="mtr-subtitle">
            Marco de trabajo para la integración de la autorregulación del aprendizaje en el desarrollo del
            pensamiento computacional en prácticas educativas de ingeniería de las ciencias de la computación
          </div>
        </div>

        <div className="right-section">
          <svg className="arc-container" viewBox="200 0 1200 900" preserveAspectRatio="none">
            <path
              className="arc-path-fill"
              d="M 100 30 Q 1000 80 1100 450 Q 1200 820 100 870 Q 800 780 900 450 Q 1000 120 100 30 Z"
            />
            <path className="arc-path" d="M 100 30 Q 1000 80 1100 450 Q 1200 820 100 870" />
            <path className="arc-path-inner" d="M 100 60 Q 900 120 1000 450 Q 1100 780 100 840" />
          </svg>

          <nav className="menu-container" ref={menuContainerRef}>
            {MENU_ITEMS.map((item) => (
              <a
                key={item.number}
                href={item.path}
                className="menu-item"
                data-curve={item.curve}
                onClick={(e) => handleMenuClick(e, item.path)}
              >
                <span className="menu-number">{item.number}</span>
                <span className="menu-line"></span>
                <span className="menu-label-text">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
