'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import Image from 'next/image';
import ModalButton from '../common/ModalButton';
import ContactForm from '../forms/ContactForm';
import styles from './HomeServicesSection.module.css';

// Prices are placeholders (marked * + footnote) until real prices are supplied
const services = [
  {
    key: 'laser',
    name: 'Лазерна епіляція',
    price: 450,
    desc: 'Гладка шкіра надовго — параметри підбираємо під ваш тип шкіри та волосся.',
    listLabel: 'Зони',
    list: ['Обличчя, пахви, бікіні', 'Ноги, руки, спина'],
    img: { src: '/media/svc-laser4.jpg', width: 1146, height: 860 },
    alt: 'Майстриня проводить лазерну епіляцію пахвової зони, клієнтка у захисних окулярах',
  },
  {
    key: 'facial',
    name: 'Догляд за обличчям',
    price: 700,
    desc: 'Програма під стан вашої шкіри — від глибокого очищення до відновлення.',
    listLabel: 'Процедури',
    list: ['Чистка обличчя', 'Пілінги', 'Масаж обличчя'],
    img: { src: '/media/svc-facial4.jpg', width: 1145, height: 860 },
    alt: 'Косметологиня наносить пілінг пензлем на обличчя клієнтки',
  },
  {
    key: 'massage',
    name: 'Масаж',
    price: 700,
    desc: 'Час, щоб видихнути: від м’якого релаксу до апаратного масажу тіла.',
    listLabel: 'Види масажу',
    list: ['Релакс-масаж', 'Лімфодренаж', 'Масаж спини', 'Апаратний масаж тіла'],
    img: { src: '/media/svc-massage4.jpg', width: 1146, height: 860 },
    alt: 'Масажистка робить масаж спини клієнтці, яка розслаблено лежить на кушетці',
  },
];

const KEY_STEP: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

// Stagger step for the one-time scroll reveal (see .svc [data-reveal])
const reveal = (i: number) => ({ '--i': i }) as CSSProperties;

const HomeServicesSection = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reveal each block once as it scrolls into view
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!items) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.setAttribute('data-visible', ''));
      return;
    }
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-visible', '');
          io.unobserve(entry.target);
        }),
      { rootMargin: '0px 0px -10% 0px' }
    );
    items.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Blush wash lights up once the section reaches the upper part of the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!('IntersectionObserver' in window)) {
      section.setAttribute('data-glow', '');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.setAttribute('data-glow', '');
        io.disconnect();
      },
      { rootMargin: '0px 0px -55% 0px' }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = KEY_STEP[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (i + step + services.length) % services.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      data-section="services"
      className={`${styles.svc} w-full`}
      aria-labelledby="svc-title"
    >
      <div className={styles.wrap}>
        <div>
          <header className={styles.head}>
            <p className={styles.kicker} data-reveal style={reveal(0)}>
              Послуги
            </p>
            <h2 className={styles.title} id="svc-title" data-reveal style={reveal(1)}>
              Три напрямки <em>догляду</em>
            </h2>
            <p className={styles.intro} data-reveal style={reveal(2)}>
              Кожна процедура починається з консультації та проходить у вашому темпі, на
              сертифікованому обладнанні.
            </p>
          </header>
          <ul
            className={styles.tabs}
            role="tablist"
            aria-label="Напрямки послуг"
            data-reveal
            style={reveal(3)}
          >
            {services.map((s, i) => (
              <li key={s.key} role="presentation">
                <button
                  ref={el => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  className={styles.tab}
                  role="tab"
                  id={`tab-${s.key}`}
                  aria-controls={`panel-${s.key}`}
                  aria-selected={i === active}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                >
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  <b>{s.name}</b>
                  <small>від {s.price} ₴*</small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panels}>
          {services.map((s, i) => (
            <article
              key={s.key}
              className={`${styles.panel} ${i === active ? styles.isActive : ''}`}
              id={`panel-${s.key}`}
              role="tabpanel"
              aria-labelledby={`tab-${s.key}`}
            >
              <figure className={styles.photo} data-reveal="clip" style={reveal(1)}>
                <Image
                  src={s.img.src}
                  width={s.img.width}
                  height={s.img.height}
                  sizes="(max-width: 900px) calc(100vw - 32px), 742px"
                  alt={s.alt}
                />
              </figure>
              <div className={styles.info} data-reveal style={reveal(4)}>
                <div className={styles.infoTop}>
                  <h3 className={styles.name}>{s.name}</h3>
                  <span className={styles.price}>
                    <small>від</small>
                    {s.price} ₴<sup>*</sup>
                  </span>
                </div>
                <p className={styles.desc}>{s.desc}</p>
                <ul className={styles.list} aria-label={s.listLabel}>
                  {s.list.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className={styles.ctaWrap}>
                  <ModalButton
                    unstyled
                    className={styles.cta}
                    buttonText={
                      <>
                        Записатися <span className={styles.arrow}>→</span>
                      </>
                    }
                    modalContent={<ContactForm />}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;
