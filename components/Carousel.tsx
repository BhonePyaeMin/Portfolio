"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "motion/react";
import "./Carousel.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const DRAG_BUFFER        = 0;
const VELOCITY_THRESHOLD = 500;
const GAP                = 24;
const SPRING = { type: "spring", stiffness: 460, damping: 38 } as const;

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Portal wrapper (avoids `position:fixed` being trapped by CSS transforms) ─
function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface CertItem { id?: number; image?: string; title?: string; text?: string; verifyUrl?: string; }

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: CertItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const item = items[index];
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft"  && canPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && canNext) onNavigate(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, canPrev, canNext, onClose, onNavigate]);

  return (
    <motion.div
      className="lb-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      {/* Prev arrow */}
      <button
        className="lb-nav lb-nav-left"
        disabled={!canPrev}
        onClick={e => { e.stopPropagation(); onNavigate(index - 1); }}
        aria-label="Previous certificate"
      >
        <ChevronLeft />
      </button>

      {/* Image frame */}
      <motion.div
        className="lb-frame"
        initial={{ scale: 0.84, opacity: 0, y: 20 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.90, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        onClick={e => e.stopPropagation()}
        key={index} // re-animate on index change
      >
        {item?.image && (
          <img
            src={item.image}
            alt={item.title ?? item.text ?? "Certificate"}
            className="lb-img"
            draggable={false}
          />
        )}

        {/* Close */}
        <button className="lb-close" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>

        {/* Caption + verify link */}
        {((item?.title ?? item?.text) || item?.verifyUrl) && (
          <div className="lb-meta">
            {(item?.title ?? item?.text) && (
              <p className="lb-caption">{item?.title ?? item?.text}</p>
            )}
            {item?.verifyUrl && (
              <a
                className="lb-verify"
                href={item.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                Verify certificate <ExternalLinkIcon />
              </a>
            )}
          </div>
        )}
      </motion.div>

      {/* Next arrow */}
      <button
        className="lb-nav lb-nav-right"
        disabled={!canNext}
        onClick={e => { e.stopPropagation(); onNavigate(index + 1); }}
        aria-label="Next certificate"
      >
        <ChevronRight />
      </button>
    </motion.div>
  );
}

// ─── Single card ──────────────────────────────────────────────────────────────
function CarouselItem({
  item, index, itemWidth, itemHeight, trackItemOffset, centerOffset, x, transition, onImageClick,
}: any) {
  const xAtCenter = centerOffset - index * trackItemOffset;
  const prev = xAtCenter + trackItemOffset;
  const next = xAtCenter - trackItemOffset;

  const rotateY   = useTransform(x, [prev, xAtCenter, next], [20, 0, -20], { clamp: false });
  const scale     = useTransform(x, [prev, xAtCenter, next], [0.78, 1.07, 0.78], { clamp: false });
  const brightness = useTransform(x, [prev, xAtCenter, next], [0.42, 1.0, 0.42], { clamp: false });
  const filter    = useTransform(brightness, (b) => `brightness(${b})`);
  const zIndex    = useTransform(x, [prev, xAtCenter, next], [1, 20, 1], { clamp: false });

  return (
    <motion.div
      className="carousel-item"
      style={{ width: itemWidth, height: itemHeight, rotateY, scale, filter, zIndex }}
      transition={transition}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.title || item.text || "Certificate"}
          draggable={false}
          onClick={() => onImageClick?.(index)}
          className="carousel-item-img"
        />
      ) : (
        <div style={{ padding: 20, color: "#fff", fontWeight: 700 }}>{item.title ?? item.text}</div>
      )}
    </motion.div>
  );
}

// ─── Main Carousel ────────────────────────────────────────────────────────────
interface CarouselProps {
  items?: CertItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  /** Which item is centred when the carousel first appears */
  initialIndex?: number;
}

export default function Carousel({
  items = [],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  initialIndex = 0,
}: CarouselProps) {
  const itemWidth       = baseWidth;
  const itemHeight      = Math.round((baseWidth / 4) * 3);
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop || !items.length) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const startIndex = Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0));
  const startPosition = loop ? startIndex + 1 : startIndex;

  const [position, setPosition]         = useState(startPosition);
  const [isHovered, setIsHovered]       = useState(false);
  const [isJumping, setIsJumping]       = useState(false);
  const [isAnimating, setIsAnimating]   = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Measure container width
  const overflowRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1280);

  useLayoutEffect(() => {
    const update = () => {
      if (overflowRef.current) setContainerWidth(overflowRef.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const centerOffset = (containerWidth - itemWidth) / 2;

  // Arrows just outside the active card
  const ARROW_W   = 42;
  const ARROW_GAP = 14;
  const arrowInset = Math.max(16, centerOffset - ARROW_W - ARROW_GAP);

  const x = useMotionValue(centerOffset - startPosition * trackItemOffset);

  useEffect(() => {
    x.set(centerOffset - position * trackItemOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerOffset]);

  // Hover pause
  useEffect(() => {
    if (!pauseOnHover || !overflowRef.current) return;
    const el  = overflowRef.current;
    const on  = () => setIsHovered(true);
    const off = () => setIsHovered(false);
    el.addEventListener("mouseenter", on);
    el.addEventListener("mouseleave", off);
    return () => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); };
  }, [pauseOnHover]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1 || (pauseOnHover && isHovered)) return;
    const t = setInterval(
      () => setPosition(p => Math.min(p + 1, itemsForRender.length - 1)),
      autoplayDelay
    );
    return () => clearInterval(t);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  // Position guard
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1)
      setPosition(Math.max(0, itemsForRender.length - 1));
  }, [itemsForRender.length, loop, position]);

  const effectiveTrans = isJumping ? { duration: 0 } : SPRING;

  // Loop jump
  const onAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) { setIsAnimating(false); return; }
    const last = itemsForRender.length - 1;
    if (position === last) {
      setIsJumping(true); setPosition(1); x.set(centerOffset - trackItemOffset);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); }); return;
    }
    if (position === 0) {
      setIsJumping(true); setPosition(items.length); x.set(centerOffset - items.length * trackItemOffset);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); }); return;
    }
    setIsAnimating(false);
  };

  // Drag
  const onDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info;
    const dir =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ?  1
      : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1 : 0;
    if (!dir) return;
    setPosition(p => Math.max(0, Math.min(p + dir, itemsForRender.length - 1)));
  };

  const dragConstraints = loop ? undefined : {
    left:  centerOffset - trackItemOffset * Math.max(itemsForRender.length - 1, 0),
    right: centerOffset,
  };

  const activeIndex =
    !items.length ? 0
    : loop ? (position - 1 + items.length) % items.length
    : Math.min(position, items.length - 1);
  const activeTitle = items[activeIndex]?.title ?? items[activeIndex]?.text ?? "";

  const canPrev = loop || position > 0;
  const canNext = loop || position < itemsForRender.length - 1;
  const goPrev  = () => !isAnimating && canPrev && setPosition(p => Math.max(0, p - 1));
  const goNext  = () => !isAnimating && canNext && setPosition(p => Math.min(p + 1, itemsForRender.length - 1));

  // When user clicks card image, open lightbox at that item's index in `items`
  const handleCardClick = (renderIndex: number) => {
    // renderIndex is index within itemsForRender (may have ghost clones for loop)
    const realItem = itemsForRender[renderIndex];
    const realIdx  = items.findIndex(it => it.image === realItem?.image);
    if (realIdx >= 0) setLightboxIndex(realIdx);
  };

  return (
    <>
      <div className="carousel-root">

        {/* Left arrow */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow-left"
          style={{ left: `${arrowInset}px` }}
          aria-label="Previous"
          disabled={!canPrev}
          onClick={goPrev}
        >
          <ChevronLeft />
        </button>

        {/* Track */}
        <div
          className="carousel-overflow"
          ref={overflowRef}
          style={{ perspective: 1100, perspectiveOrigin: "50% 50%" }}
        >
          <motion.div
            className="carousel-track"
            drag={isAnimating ? false : "x"}
            dragConstraints={dragConstraints}
            style={{ width: itemWidth, gap: `${GAP}px`, x }}
            onDragEnd={onDragEnd}
            animate={{ x: centerOffset - position * trackItemOffset }}
            transition={effectiveTrans}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={onAnimationComplete}
          >
            {itemsForRender.map((item, index) => (
              <CarouselItem
                key={`${item?.id ?? index}-${index}`}
                item={item}
                index={index}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
                trackItemOffset={trackItemOffset}
                centerOffset={centerOffset}
                x={x}
                transition={effectiveTrans}
                onImageClick={handleCardClick}
              />
            ))}
          </motion.div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow-right"
          style={{ right: `${arrowInset}px` }}
          aria-label="Next"
          disabled={!canNext}
          onClick={goNext}
        >
          <ChevronRight />
        </button>

        {/* Caption */}
        <p className="carousel-title">{activeTitle}</p>

        {/* Dots */}
        <div className="carousel-dots">
          {items.map((_, i) => (
            <motion.button
              type="button" key={i}
              className={`carousel-dot ${activeIndex === i ? "active" : "inactive"}`}
              aria-label={`Go to slide ${i + 1}`}
              animate={{ scale: activeIndex === i ? 1 : 0.85 }}
              onClick={() => setPosition(loop ? i + 1 : i)}
              transition={{ duration: 0.12 }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox — rendered at <body> via portal so CSS transforms don't trap `position:fixed` */}
      <BodyPortal>
        <AnimatePresence>
          {lightboxIndex !== null && (
            <Lightbox
              items={items}
              index={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              onNavigate={setLightboxIndex}
            />
          )}
        </AnimatePresence>
      </BodyPortal>
    </>
  );
}
