'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ModalButton from '../common/ModalButton';
import ContactForm from '../forms/ContactForm';
import styles from './HomeHeroSection.module.css';

// Montage: one label per clip, each clip CLIP_SECONDS long
const CLIP_SECONDS = 2.9;
const MONTAGE_LABELS = [
  'Апаратний догляд',
  'Масаж обличчя',
  'Догляд за обличчям',
  'Лазерна епіляція',
  'Масаж обличчя',
  'Маска для обличчя',
  'Апаратний масаж тіла',
  'Догляд за обличчям',
];

const services = [
  { path: '/services/laser-hair-removal', label: 'Лазерна епіляція' },
  { path: '/services/face-care', label: 'Догляд за обличчям' },
  { path: '/services/massage', label: 'Масаж' },
];

const delay = (d: number) => ({ '--d': d }) as CSSProperties;

const HomeHeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
    } else if (video.paused) {
      // autoplay can be blocked or not kick in after hydration
      video.play().catch(() => setIsPaused(true));
    }
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const i = Math.floor((video.currentTime + 0.3) / CLIP_SECONDS) % MONTAGE_LABELS.length;
    setLabelIndex(prev => (prev === i ? prev : i));
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setIsPaused(true));
    else video.pause();
  };

  return (
    <section className={`${styles.hero} w-full mt-[64px]`}>
      <div className={styles.card}>
        <div className={styles.mediaFg}>
          <Image
            fill
            priority
            sizes="100vw"
            src="/media/hero-photo-wide-moody.jpg"
            alt="Клієнтка Skinera спокійно відпочиває на кушетці в процедурному кабінеті"
            className={styles.photo}
          />
        </div>
        <div className={styles.edgeBlur} aria-hidden="true" />

        <div className={styles.videoTile}>
          <video
            id="hero-video"
            ref={videoRef}
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/media/hero2-montage-poster.webp"
            aria-label="Процедури в студії Skinera: догляд за обличчям, масаж, лазерна епіляція"
            onPlay={() => setIsPaused(false)}
            onPause={() => setIsPaused(true)}
            onTimeUpdate={handleTimeUpdate}
          >
            <source src="/media/hero2-montage.webm" type="video/webm" />
            <source src="/media/hero2-montage.mp4" type="video/mp4" />
          </video>
          <span className={styles.tileLabel}>
            {MONTAGE_LABELS[labelIndex]} ·<br />
            як це відбувається
          </span>
          <button
            type="button"
            className={styles.mediaToggle}
            aria-controls="hero-video"
            aria-pressed={isPaused}
            aria-label={isPaused ? 'Відтворити відео' : 'Пауза відео'}
            onClick={togglePlayback}
          />
        </div>

        <div className={styles.shade} />
        <div className={styles.vignette} />
        <div className={styles.grain} aria-hidden="true" />

        <div className={styles.content}>
          <p className={`${styles.kicker} ${styles.rise}`} style={delay(1)}>
            Студія краси · Львів
          </p>
          <h1 className={`${styles.wordmark} ${styles.rise}`} style={delay(2)}>
            Skinera
          </h1>
          <div className={styles.row}>
            <div className={`${styles.lead} ${styles.rise}`} style={delay(3)}>
              <span className={styles.rule} />
              <p>
                Лазерна епіляція, професійний догляд за обличчям і масаж — у&nbsp;затишній студії
                у&nbsp;Львові.
              </p>
            </div>
            <div className={`${styles.ctaWrap} ${styles.rise}`} style={delay(4)}>
              <ModalButton
                unstyled
                className={styles.cta}
                buttonText={
                  <>
                    Записатися на консультацію <span className={styles.arrow}>→</span>
                  </>
                }
                modalContent={<ContactForm />}
              />
            </div>
          </div>
        </div>

        <ul className={`${styles.chips} ${styles.rise}`} style={delay(5)} aria-label="Послуги">
          {services.map(({ path, label }) => (
            <li key={path}>
              <Link className={styles.chip} href={path}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeHeroSection;
