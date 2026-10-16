'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import Image from 'next/image';
import ModalButton from '../common/ModalButton';
import ContactForm from '../forms/ContactForm';
import styles from './HomeResultsSection.module.css';

// Real client photos, published with consent. No session counts until real numbers are supplied
const cases = [
  {
    key: 'chin',
    zone: 'Підборіддя',
    img: { width: 1122, height: 1402 },
    lead: true,
  },
  {
    key: 'armpit',
    zone: 'Пахви',
    img: { width: 1122, height: 1402 },
    focus: '50% 30%',
  },
  {
    // TODO: replace with a 4:5 pair ≥1200×1500 when available
    key: 'bikini',
    zone: 'Зона бікіні',
    img: { width: 1101, height: 535 },
  },
];

const clamp = (n: number) => Math.min(100, Math.max(0, n));

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setPos(ba: HTMLElement, v: number, ease = false) {
  ba.classList.toggle(styles.isEase, ease && !prefersReduced());
  ba.style.setProperty('--pos', `${v}%`);
  const input = ba.querySelector('input');
  if (!input) return;
  input.value = String(Math.round(v));
  input.setAttribute('aria-valuetext', `Після: ${100 - Math.round(v)}%`);
}

type Case = (typeof cases)[number];

const BeforeAfter = ({ c }: { c: Case }) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return clamp(((e.clientX - r.left) / r.width) * 100);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button > 0) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add(styles.isDrag);
    setPos(e.currentTarget, fromEvent(e), true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setPos(e.currentTarget, fromEvent(e));
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    e.currentTarget.classList.remove(styles.isDrag);
  };

  // One gentle "it moves" swing when the lead slider first comes into view
  useEffect(() => {
    const ba = ref.current;
    if (!ba || !c.lead || prefersReduced() || !('IntersectionObserver' in window)) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        [32, 66, 50].forEach((v, i) =>
          timers.push(window.setTimeout(() => setPos(ba, v, true), 400 + i * 750))
        );
      },
      { threshold: 0.6 }
    );
    io.observe(ba);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [c.lead]);

  const label = c.zone.toLowerCase();
  const sizes = c.lead
    ? '(max-width: 600px) calc(100vw - 32px), (max-width: 900px) 100vw, 780px'
    : '(max-width: 600px) calc(100vw - 32px), (max-width: 900px) 50vw, 560px';

  return (
    <div
      ref={ref}
      className={styles.ba}
      style={c.focus ? ({ '--focus': c.focus } as CSSProperties) : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {(['before', 'after'] as const).map(side => (
        <div
          key={side}
          className={`${styles.layer} ${side === 'after' ? styles.after : styles.before}`}
        >
          <Image
            src={`/media/before-after/${c.key}-${side}.webp`}
            width={c.img.width}
            height={c.img.height}
            sizes={sizes}
            alt={`${c.zone}: ${side === 'before' ? 'до' : 'після'} курсу лазерної епіляції`}
            draggable={false}
          />
          <span className={styles.tag}>{side === 'before' ? 'До' : 'Після'}</span>
        </div>
      ))}
      <span className={styles.line} aria-hidden="true" />
      <span className={styles.knob} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
        </svg>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        aria-label={`Порівняти до і після: ${label}`}
        aria-valuetext="Після: 50%"
        onInput={e => ref.current && setPos(ref.current, +e.currentTarget.value)}
      />
    </div>
  );
};

const HomeResultsSection = () => (
  <section id="results" className={`${styles.res} w-full`} aria-labelledby="res-title">
    <div className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>Результати</p>
          <h2 className={styles.title} id="res-title">
            Результати <em>клієнток</em>
          </h2>
        </div>
        <div>
          <p className={styles.intro}>
            Потягніть повзунок, щоб порівняти шкіру до курсу і після нього. Фото публікуємо лише за
            згодою клієнток.
          </p>
          <ModalButton
            unstyled
            className={styles.cta}
            buttonText={
              <>
                Записатися на консультацію{' '}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </>
            }
            modalContent={<ContactForm />}
          />
        </div>
      </header>

      <div className={styles.grid}>
        {cases.map(c => (
          <figure key={c.key} className={`${styles.fig} ${c.lead ? styles.figLead : ''}`}>
            <BeforeAfter c={c} />
            <figcaption className={styles.cap}>
              <span className={styles.capSvc}>Лазерна епіляція</span>
              <h3 className={styles.capName}>{c.zone}</h3>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.foot}>
        <p className={styles.note}>
          Результат індивідуальний і залежить від типу шкіри та волосся.
        </p>
      </div>
    </div>
  </section>
);

export default HomeResultsSection;
