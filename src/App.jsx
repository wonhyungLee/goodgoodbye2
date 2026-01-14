import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, RefreshCw, Camera } from 'lucide-react';
import imgMarch1 from './assets/image/20250312_132919.jpg';
import imgMay1 from './assets/image/20250515_094343.jpg';
import imgMay2 from './assets/image/20250515_105711.jpg';
import imgMay3 from './assets/image/20250515_105931.jpg';
import imgJune1 from './assets/image/20250604_105254.jpg';
import imgJune2 from './assets/image/20250604_105612.jpg';
import imgSpecial from './assets/image/IMG_0502.jpg';

/**
 * 고급스러운 노이즈 텍스처 오버레이
 */
const NoiseOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-[5] opacity-[0.07] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
  />
);

/**
 * 시네마틱 파티클 배경
 */
const CinematicBackground = ({ season }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    class Particle {
      constructor(type) {
        this.reset(type, true);
      }

      reset(type, randomY = false) {
        this.type = type;
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : -50;
        
        if (type === 'winter') {
          this.size = Math.random() * 2 + 1;
          this.speedX = Math.random() * 0.5 - 0.25;
          this.speedY = Math.random() * 0.8 + 0.3;
          this.opacity = Math.random() * 0.5 + 0.3;
        } else {
          this.size = Math.random() * 5 + 3;
          this.speedX = Math.random() * 1.5 - 0.75;
          this.speedY = Math.random() * 1 + 0.5;
          this.rotation = Math.random() * 360;
          this.rotationSpeed = Math.random() * 1 - 0.5;
          this.opacity = Math.random() * 0.6 + 0.4;
        }
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.005) + this.speedX;
        if (this.type === 'spring') {
            this.rotation += this.rotationSpeed;
        }

        if (this.y > height + 50) {
          this.reset(this.type);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        
        if (this.type === 'winter') {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'white';
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#FECDD3';
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, -this.size / 2, this.size, 0);
          ctx.bezierCurveTo(this.size, this.size / 2, this.size / 2, this.size / 2, 0, 0);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 30 : 60;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(season));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

/**
 * 텍스트 슬라이드
 */
const TextSlide = ({ data, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-20 z-10 transition-opacity duration-1000">
      <div className="max-w-2xl w-full text-center space-y-10 animate-[fadeInUp_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        
        <div className="flex justify-center items-center gap-3 opacity-60">
            <div className={`h-[1px] w-12 ${data.theme === 'dark' ? 'bg-white' : 'bg-stone-800'}`}></div>
            <span className={`font-serif text-sm tracking-[0.2em] uppercase ${data.theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                {data.label}
            </span>
            <div className={`h-[1px] w-12 ${data.theme === 'dark' ? 'bg-white' : 'bg-stone-800'}`}></div>
        </div>

        <h2 className={`text-3xl md:text-5xl font-bold font-serif leading-tight break-keep tracking-tight
            ${data.theme === 'dark' ? 'text-white drop-shadow-lg' : 'text-stone-900'}
        `}>
          {data.title}
        </h2>

        <div className={`text-lg md:text-xl font-light leading-loose font-serif break-keep whitespace-pre-line
            ${data.theme === 'dark' ? 'text-slate-200' : 'text-stone-600'}
        `}>
          {data.content}
        </div>

      </div>
    </div>
  );
};

/**
 * 사진 슬라이드 컴포넌트
 */
const PhotoSlide = ({ data, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
      <div className="relative animate-[fadeInUp_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        {/* 프레임 */}
        <div className="bg-white p-4 md:p-6 shadow-2xl rotate-1 transform transition-transform hover:rotate-0 duration-500 max-w-lg mx-auto">
          <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 mb-4">
             <img 
               src={data.image} 
               alt={data.date} 
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
             />
          </div>
          <div className="flex justify-between items-end font-serif text-stone-600">
             <div className="text-sm tracking-widest uppercase opacity-70">{data.label}</div>
             <div className="text-xs italic opacity-50">{data.date}</div>
          </div>
        </div>
        
        {/* 캡션 */}
        {data.content && (
            <div className="mt-8 text-center">
                <p className={`text-lg font-serif italic ${data.theme === 'dark' ? 'text-white/90' : 'text-stone-800'}`}>
                    "{data.content}"
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(0);
  
  const slides = [
    {
      id: 0,
      type: 'text',
      season: 'winter',
      theme: 'dark',
      label: 'Prologue',
      title: "사랑하는\n2-2반 친구들에게",
      content: "어느덧 우리가 함께한 1년이라는 시간이\n훌쩍 지나갔구나.\n\n겨울이 가고 새로운 계절이 오는 것처럼,\n몸도 마음도 훌쩍 자란 너희들을 보며\n선생님은 참 뿌듯했단다."
    },
    {
      id: 1,
      type: 'photo',
      season: 'winter',
      theme: 'dark',
      label: 'Memory of March',
      date: '2025.03.12',
      image: imgMarch1,
      content: "설레던 우리들의 첫 만남"
    },
    {
      id: 2,
      type: 'text',
      season: 'spring',
      theme: 'light',
      label: 'From Teacher',
      title: "너희에게 전하고 싶은\n세 가지 이야기",
      content: "헤어짐을 앞두고,\n너희가 앞으로 살아가는 데 힘이 되어줄\n이야기들을 펜으로 적어보았어."
    },
    {
      id: 3,
      type: 'text',
      season: 'spring',
      theme: 'light',
      label: 'Chapter. 01',
      title: "배움을\n미리 포기하지 말렴",
      content: "지금 성적이 나오지 않는다고\n'난 안 되나 봐'라고 단정 짓기엔 너무 이르단다.\n\n너희의 두뇌는 지금도 계속 자라고 있어.\n아직 꽃피우지 않았을 뿐,\n언제 놀랍게 성장할지 아무도 모른단다.\n\n스스로의 가능성을 믿으렴."
    },
    {
        id: 4,
        type: 'photo',
        season: 'spring',
        theme: 'light',
        label: 'Memory of May',
        date: '2025.05.15',
        image: imgMay1,
        content: "따스했던 봄날의 체육대회"
    },
    {
        id: 5,
        type: 'photo',
        season: 'spring',
        theme: 'light',
        label: 'Memory of May',
        date: '2025.05.15',
        image: imgMay3,
        content: "함께 웃으며 흘린 땀방울"
    },
    {
      id: 6,
      type: 'text',
      season: 'spring',
      theme: 'light',
      label: 'Chapter. 02',
      title: "성실함은\n가장 큰 무기란다",
      content: "화려한 말솜씨보다 중요한 건 성실한 태도야.\n\n당장은 아무도 몰라주는 것 같아도,\n묵묵히 노력하는 너의 진심은\n언젠가 반드시 빛을 발하고\n주변 사람들에게 인정받는 날이 올 거야."
    },
    {
        id: 7,
        type: 'photo',
        season: 'spring',
        theme: 'light',
        label: 'Memory of June',
        date: '2025.06.04',
        image: imgJune1,
        content: "더위도 잊은 채 집중하던 시간"
    },
    {
      id: 8,
      type: 'text',
      season: 'spring',
      theme: 'light',
      label: 'Chapter. 03',
      title: "나와 타인을\n모두 존중하렴",
      content: "타인을 존중한다고 내가 낮아지는 게 아니란다.\n오히려 친구들을 존중할 때,\n너 또한 깊은 존중을 받게 될 거야.\n\n나 자신을 소중히 여기는 만큼\n타인도 귀하게 여기는 멋진 사람이 되길 바란다."
    },
    {
        id: 9,
        type: 'photo',
        season: 'spring',
        theme: 'light',
        label: 'Unforgettable',
        date: 'Always',
        image: imgSpecial,
        content: "우리가 함께 만든 모든 순간들"
    },
    {
      id: 10,
      type: 'text',
      season: 'spring',
      theme: 'light',
      label: 'Epilogue',
      title: "너희들의 담임이어서\n행복했다",
      content: (
        <>
          1년 동안 정말 고생 많았고,<br/>
          너희의 앞날에 늘 행운이 가득하기를 빈다.
          <div className="mt-16 text-right">
            <p className="text-sm text-stone-500 mb-2 tracking-widest uppercase">From.</p>
            <p className="text-3xl font-bold font-serif text-stone-900 border-b border-stone-800 inline-block pb-2">이원형 선생님이</p>
          </div>
        </>
      )
    }
  ];

  const currentSlide = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) setStep(s => s + 1);
  };

  const handleRestart = () => {
    setStep(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@200;300;400;600;700&display=swap');
        .font-serif { font-family: 'Noto Serif KR', serif; }
        .font-batang { font-family: 'Gowun Batang', serif; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>

      {/* 배경 레이어 */}
      <div 
        className={`absolute inset-0 transition-colors duration-[2000ms] ease-in-out
          ${currentSlide.season === 'winter' 
            ? 'bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617]' 
            : 'bg-gradient-to-br from-[#fdfbf7] via-[#f7f2e8] to-[#e7e0d3]'}
        `}
      />

      <NoiseOverlay />
      <CinematicBackground season={currentSlide.season} />

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 w-full h-full">
        {slides.map((slide, idx) => (
            idx === step && (
                slide.type === 'photo' ? (
                    <PhotoSlide key={slide.id} data={slide} isActive={true} />
                ) : (
                    <TextSlide key={slide.id} data={slide} isActive={true} />
                )
            )
        ))}
      </main>

      {/* 하단 네비게이션 */}
      <div className="absolute bottom-10 left-0 w-full z-20 flex flex-col items-center justify-center gap-6 animate-[fadeIn_2s_delay-1s]">
        
        {/* 진행 상태 바 */}
        <div className="flex gap-1.5 mb-2 px-6 flex-wrap justify-center">
            {slides.map((_, idx) => (
                <div 
                    key={idx}
                    className={`h-[2px] transition-all duration-500 rounded-full
                        ${idx === step 
                            ? (currentSlide.theme === 'dark' ? 'w-6 bg-white' : 'w-6 bg-stone-800')
                            : (currentSlide.theme === 'dark' ? 'w-2 bg-white/20' : 'w-2 bg-stone-800/20')
                        }
                    `}
                />
            ))}
        </div>

        {/* 버튼 영역 */}
        {step < slides.length - 1 ? (
            <button 
                onClick={handleNext}
                className={`
                    group relative px-8 py-3 overflow-hidden rounded-full transition-all duration-500
                    ${currentSlide.theme === 'dark' 
                        ? 'text-white border border-white/30 hover:bg-white/10' 
                        : 'text-stone-800 border border-stone-800/30 hover:bg-stone-800/5'
                    }
                `}
            >
                <span className="relative z-10 flex items-center gap-2 font-serif text-sm tracking-widest uppercase">
                    Next
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                </span>
            </button>
        ) : (
            <button 
                onClick={handleRestart}
                className="group flex items-center gap-2 px-6 py-3 text-stone-500 hover:text-stone-800 transition-colors font-serif text-sm tracking-widest uppercase"
            >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500"/>
                Replay
            </button>
        )}

        <div className={`text-[10px] tracking-widest uppercase opacity-40 font-serif ${currentSlide.theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
            &copy; 2026. From Teacher Lee
        </div>
      </div>

    </div>
  );
}
