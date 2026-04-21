import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Youtube, MessageCircle, Phone, GraduationCap } from 'lucide-react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const symbols = ['∫', '∑', '∞', 'π', '√', '★', '✦', '+', '-', '×', '÷'];
    const colors = ['#00d4ff', '#0059ff', '#ffffff'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      spdX: number;
      spdY: number;
      symbol: string;
      size: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.spdX = (Math.random() - 0.5) * 1.5;
        this.spdY = (Math.random() - 0.5) * 1.5;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.size = Math.random() * 15 + 10;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.4 + 0.1;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.spdX;
        this.y += this.spdY;

        if (this.x < 0 || this.x > canvas!.width) this.spdX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.spdY *= -1;

        // Repel effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 5;
          this.y -= (dy / dist) * force * 5;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px monospace`;
        ctx.fillText(this.symbol, this.x, this.y);
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      particles.forEach((p) => {
        p.update(mx, my);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 400, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 400, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Only attach if device likely has a mouse
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-5 h-5 rounded-full bg-cyan-400 mix-blend-screen pointer-events-none z-50 shadow-[0_0_15px_1px_rgba(0,212,255,0.9)] hidden md:block"
      style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
    />
  );
};

export default function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  const links = [
    {
      title: "YouTube Channel",
      subtitle: "Exam Models & Tutorials",
      url: "https://www.youtube.com/@engshehabelebady1",
      icon: <Youtube className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]" />,
      delay: 0.1
    },
    {
      title: "WhatsApp Group",
      subtitle: "Q&A Support",
      url: "https://chat.whatsapp.com/EqW5kZnqCIG4i9viyVeMsb",
      icon: <MessageCircle className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]" />,
      delay: 0.2
    },
    {
      title: "Direct Contact",
      subtitle: "WhatsApp",
      url: "https://wa.me/201201212002",
      icon: <Phone className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]" />,
      delay: 0.3
    }
  ];

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#00d4ff]/30">
      <ParticleBackground />
      <CustomCursor />

      {/* Radial Gradients Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,#002b5e_0%,transparent_50%),radial-gradient(circle_at_20%_80%,#001a35_0%,transparent_50%)] z-[-1]" />

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-10 mx-auto w-full max-w-[1024px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col md:flex-row gap-10 md:gap-[40px] items-center justify-center"
        >
          {/* Profile Container (Left Column) */}
          <div className="flex-[0_0_100%] md:flex-[0_0_380px] flex flex-col items-center justify-center text-center">
            <motion.div 
              variants={itemVariants}
              className="mb-6 relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 rounded-full bg-[#00d4ff] blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
              <img 
                src="https://i.postimg.cc/nVg4Fq3R/Whats-App-Image-2026-01-05-at-08-20-43-c113e2d2.jpg" 
                alt="Eng. Shehab Elebady" 
                className="relative w-[220px] h-[220px] object-cover rounded-full border-[4px] border-[#00d4ff] shadow-[0_0_30px_rgba(0,212,255,0.5)] z-10"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-3">
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#0059ff] text-white px-[16px] py-[6px] rounded-full text-[14px] font-[700] tracking-[1px] uppercase inline-block">
                The Math Star
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-[42px] m-0 leading-[1.1] font-[800] bg-gradient-to-b from-white to-[#94a3b8] bg-clip-text text-transparent">
              Eng. Shehab Elebady
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-[#00d4ff] text-[18px] mt-[12px] font-light italic">
              "From Zero to Hero in Mathematics"
            </motion.p>
          </div>

          {/* Content Container (Right Column) */}
          <div className="flex-1 flex flex-col justify-center gap-[24px] w-full">
            
            {/* About Me Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/[0.03] backdrop-blur-[12px] border border-white/10 rounded-[24px] p-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <p className="text-[#cbd5e1] leading-[1.6] text-[17px] m-0">
                Computer Engineering graduate with a profound passion for Mathematics. I utilize my engineering mindset to simplify complex mathematical concepts, delivering them in a logical and seamless manner. My goal is to elevate every student's level from zero to hero, as mathematics is the language of logic and success.
              </p>
            </motion.div>

            {/* Action Links */}
            <div className="grid gap-[16px] w-full">
              {links.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  className="group relative flex items-center justify-between py-[20px] px-[24px] bg-[#00d4ff]/[0.05] border border-[#00d4ff]/20 rounded-[16px] text-white transition-all duration-300 hover:border-[#00d4ff] hover:bg-[#00d4ff]/[0.15] hover:translate-x-[10px] hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                >
                  <div className="flex items-center text-left z-10 gap-4">
                    <div className="flex items-center justify-center shrink-0">
                      <span className="text-[#00d4ff]">
                        {link.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-[600] text-white group-hover:text-[#00d4ff] transition-colors">
                        {link.title} - {link.subtitle}
                      </h4>
                    </div>
                  </div>

                  <div className="z-10 text-[#00d4ff] group-hover:text-cyan-200 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
