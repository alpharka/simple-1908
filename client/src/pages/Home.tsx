/**
 * Design reminder: Quiet Editorial Card — a warm, spacious, photo-led, single-scroll
 * wedding invitation. Typography, hairline rules, and restrained olive detail lead; ornament does not.
 */

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  CalendarPlus,
  Check,
  ChevronRight,
  CirclePlay,
  Copy,
  Heart,
  Instagram,
  MapPin,
  Music2,
  Pause,
  Play,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { invitationData, InvitationEvent } from "@/data/invitationData";

const assets = {
  mark: "/manus-storage/msd-ribbon-mark_e2eb8b6b.png",
  paperLight: "/manus-storage/msd-paper-light_1aff54b2.png",
  paperWarm: "/manus-storage/msd-paper-warm_f92cda4d.png",
  paperDark: "/manus-storage/msd-paper-dark_779c0763.png",
  rsvpCard: "/manus-storage/msd-rsvp-card_6749c916.png",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function calendarHref(event: InvitationEvent) {
  const date = event.date.replaceAll("-", "");
  const time = event.time.match(/\d{2}:\d{2}/)?.[0].replace(":", "") ?? "0000";
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${date}T${time}00`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}, ${event.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}

function mapEmbedUrl(event: InvitationEvent) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${event.venue}, ${event.address}`)}&output=embed`;
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : url;
  } catch {
    return url;
  }
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-intro">{description}</p> : null}
    </div>
  );
}

function EventCard({ event }: { event: InvitationEvent }) {
  return (
    <article className="event-card">
      <div className="event-card__topline">
        <span className="event-card__index">{event.title === invitationData.events.ceremony.title ? "01" : "02"}</span>
        <span className="event-card__rule" />
      </div>
      <h3>{event.title}</h3>
      <dl className="event-details">
        <div>
          <dt>Hari & tanggal</dt>
          <dd>{formatDate(event.date)}</dd>
        </div>
        <div>
          <dt>Waktu</dt>
          <dd>{event.time}</dd>
        </div>
        <div>
          <dt>Lokasi</dt>
          <dd>
            {event.venue}
            <br />
            <span>{event.address}</span>
          </dd>
        </div>
      </dl>
      <div className="map-frame">
        <iframe
          title={`Peta lokasi ${event.title}`}
          src={mapEmbedUrl(event)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="event-actions">
        <a className="text-action" href={event.googleMaps} target="_blank" rel="noreferrer" aria-label={`Lihat peta ${event.title} di Google Maps`}>
          <MapPin size={16} aria-hidden="true" />
          Lihat peta
        </a>
        <a className="text-action" href={calendarHref(event)} download={`${event.title.toLowerCase().replaceAll(" ", "-")}.ics`} aria-label={`Tambahkan ${event.title} ke kalender`}>
          <CalendarPlus size={16} aria-hidden="true" />
          Simpan tanggal
        </a>
      </div>
    </article>
  );
}

function MediaPanel({ title, youtubeUrl, thumbnail }: { title: string; youtubeUrl: string; thumbnail?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <article className="media-panel">
      <div className="media-panel__frame">
        {isPlaying ? (
          <iframe
            title={title}
            src={getYouTubeEmbedUrl(youtubeUrl)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="media-panel__poster"
            onClick={() => setIsPlaying(true)}
            style={{ backgroundImage: `url(${thumbnail ?? assets.paperDark})` }}
            aria-label={`Putar ${title}`}
          >
            <span className="media-panel__shade" />
            <span className="play-disc"><CirclePlay size={44} strokeWidth={1.25} aria-hidden="true" /></span>
            <span className="media-panel__label">Putar video</span>
          </button>
        )}
      </div>
      <h3>{title}</h3>
    </article>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copyValue = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1700);
  };
  return (
    <button type="button" onClick={copyValue} className="copy-button" aria-label={`${label}: ${copied ? "sudah disalin" : "salin"}`}>
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ image: string; caption: string } | null>(null);
  const [wishSent, setWishSent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const openInvitation = async () => {
    setIsOpened(true);
    window.setTimeout(() => document.querySelector("#invitation")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch {
        setIsMusicPlaying(false);
      }
      return;
    }
    audio.pause();
    setIsMusicPlaying(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const submitWish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWishSent(true);
    event.currentTarget.reset();
  };

  const { couple, cover, events, guest, rsvp, stories, gallery, videos, livestream, gifts, physicalGift, wishes, closing } = invitationData;

  return (
    <main className="invitation-shell">
      <audio ref={audioRef} src={cover.backgroundMusic} preload="none" onEnded={() => setIsMusicPlaying(false)} />

      <section className="cover" aria-labelledby="cover-title">
        <img className="cover__image" src={cover.backgroundImage} alt={`Foto sampul ${cover.subtitle}`} />
        <div className="cover__scrim" />
        <div className="cover__paper-edge" />
        <div className="cover__content">
          <img className="brand-mark brand-mark--cover" src={assets.mark} alt="" aria-hidden="true" />
          <p className="cover__eyebrow">{cover.title}</p>
          <h1 id="cover-title">
            <span>{couple.bride.nickname}</span>
            <i>&amp;</i>
            <span>{couple.groom.nickname}</span>
          </h1>
          <span className="cover__hairline" />
          <p className="cover__guest-label">Kepada Yth.</p>
          <p className="cover__guest">{guest.name}</p>
          <p className="cover__message">Kami mengundang Anda untuk hadir di hari bahagia kami.</p>

          <div className="cover__controls">
            <button type="button" className="music-button" onClick={toggleMusic} aria-label={isMusicPlaying ? "Jeda musik latar" : "Putar musik latar"}>
              {isMusicPlaying ? <Pause size={15} aria-hidden="true" /> : <Music2 size={15} aria-hidden="true" />}
              <span>{isMusicPlaying ? "Jeda musik" : "Musik latar"}</span>
            </button>
            <button type="button" className="mute-button" onClick={toggleMute} aria-label={isMuted ? "Nyalakan suara" : "Matikan suara"}>
              {isMuted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            </button>
          </div>

          <Button onClick={openInvitation} className="open-button">
            <span>Buka Undangan</span>
            <ArrowDown size={16} aria-hidden="true" />
          </Button>
        </div>
      </section>

      <div id="invitation" className={isOpened ? "invitation-content is-opened" : "invitation-content"}>
        <section className="masthead section section--paper" aria-labelledby="masthead-title">
          <Reveal>
            <div className="masthead__frame">
              <p className="eyebrow">Undangan Pernikahan</p>
              <h2 id="masthead-title">{cover.subtitle}</h2>
              <p>{formatDate(events.ceremony.date)}</p>
            </div>
          </Reveal>
        </section>

        <section className="epigraph section section--quiet" aria-label="Pembuka undangan">
          <Reveal>
            <blockquote>
              <p>“Dua hati, satu arah, dan sebuah hari yang ingin kami rayakan bersama orang-orang terkasih.”</p>
            </blockquote>
          </Reveal>
        </section>

        <section className="couple-section section section--paper" aria-labelledby="couple-title">
          <Reveal><SectionHeading eyebrow="Kedua Mempelai" title="Mempelai" /></Reveal>
          <div className="couple-grid">
            {[
              { person: couple.bride, role: "The Bride", align: "left" },
              { person: couple.groom, role: "The Groom", align: "right" },
            ].map(({ person, role, align }, index) => (
              <Reveal key={person.fullName} delay={index * 120} className={`couple-card couple-card--${align}`}>
                <figure className="portrait-frame">
                  <img src={person.photo} alt={`Potret ${person.fullName}`} loading="lazy" />
                </figure>
                <div className="couple-card__copy">
                <p className="eyebrow">{role === "The Bride" ? "Mempelai Wanita" : "Mempelai Pria"}</p>
                  <h3>{person.fullName}</h3>
                  <p className="parent-copy">Putra/Putri dari<br />{person.father} &amp; {person.mother}</p>
                  <a className="instagram-link" href={`https://instagram.com/${person.instagram}`} target="_blank" rel="noreferrer">
                    <Instagram size={15} aria-hidden="true" /> @{person.instagram}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="events-section section section--soft" aria-labelledby="events-title">
          <Reveal><SectionHeading eyebrow="Simpan Tanggal" title="Rangkaian Acara" description="Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu." /></Reveal>
          <div className="event-stack">
            <Reveal><EventCard event={events.ceremony} /></Reveal>
            <Reveal delay={110}><EventCard event={events.reception} /></Reveal>
          </div>
        </section>

        <section className="rsvp-section section section--paper" aria-labelledby="rsvp-title">
          <Reveal>
            <div className="rsvp-card" style={{ backgroundImage: `url(${assets.rsvpCard})` }}>
              <div className="rsvp-card__inner">
                <SectionHeading eyebrow="Mohon Konfirmasi" title="Konfirmasi Kehadiran" />
                {rsvp.enabled ? (
                  <>
                    <p className="rsvp-card__deadline">Mohon konfirmasi sebelum <strong>{formatDate(rsvp.deadline)}</strong>.</p>
                    <button className="muted-button" type="button" disabled aria-disabled="true">Tautan RSVP belum tersedia</button>
                  </>
                ) : (
                  <p className="rsvp-card__deadline">Konfirmasi kehadiran tidak tersedia.</p>
                )}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="stories-section section section--paper" aria-labelledby="stories-title">
          <Reveal><SectionHeading eyebrow="Perjalanan Kami" title="Cerita Kami" /></Reveal>
          <div className="story-list">
            {stories.map((story, index) => (
              <Reveal key={story.title} delay={index * 100} className={`story-card ${index % 2 ? "story-card--reverse" : ""}`}>
                <figure className="story-card__photo"><img src={story.photo} alt={`${story.title}: ${story.date}`} loading="lazy" /></figure>
                <div className="story-card__copy">
                  <p className="eyebrow">{story.date}</p>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="gallery-section section section--soft" aria-labelledby="gallery-title">
          <Reveal><SectionHeading eyebrow="Dalam Bingkai" title="Galeri" /></Reveal>
          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <Reveal key={item.caption} delay={index * 110}>
                <button type="button" className="gallery-item" onClick={() => setSelectedImage(item)} aria-label={`Buka foto ${item.caption}`}>
                  <img src={item.image} alt={item.caption} loading="lazy" />
                  <span>{item.caption}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="video-section section section--paper" aria-labelledby="video-title">
          <Reveal><SectionHeading eyebrow="Momen Dalam Gerak" title="Video" /></Reveal>
          <div className="media-grid">
            {videos.map((video, index) => <Reveal key={video.title} delay={index * 100}><MediaPanel {...video} /></Reveal>)}
          </div>
        </section>

        <section className="livestream-section section section--charcoal" aria-labelledby="livestream-title" style={{ backgroundImage: `url(${assets.paperDark})` }}>
          <Reveal>
            <div className="livestream-layout">
              <div className="livestream-layout__copy">
                <p className="eyebrow">Bersama Dari Jauh</p>
                <h2 id="livestream-title">Siaran Langsung</h2>
                <p>Saksikan hari bahagia kami dari mana pun Anda berada.</p>
              </div>
              <MediaPanel title="Siaran Langsung" youtubeUrl={livestream.youtubeUrl} />
            </div>
          </Reveal>
        </section>

        <section className="gifts-section section section--paper" aria-labelledby="gifts-title">
          <Reveal><SectionHeading eyebrow="Dengan Penuh Kasih" title="Kirim Hadiah" description="Kehadiran dan doa restu Anda adalah hadiah yang paling berarti bagi kami." /></Reveal>
          <div className="gift-grid">
            {gifts.map((gift, index) => (
              <Reveal key={gift.accountNumber} delay={index * 100}>
                <article className="gift-card">
                  <p className="eyebrow">{gift.bankName}</p>
                  <p className="account-number">{gift.accountNumber}</p>
                  <p className="account-holder">a.n. {gift.accountHolder}</p>
                  <CopyButton value={gift.accountNumber} label="Nomor rekening" />
                </article>
              </Reveal>
            ))}
            <Reveal delay={110}>
              <article className="gift-card gift-card--address">
                <p className="eyebrow">Kirim Kado</p>
                <p className="address-recipient">{physicalGift.recipient}</p>
                <p className="address-copy">{physicalGift.address}</p>
                <CopyButton value={`${physicalGift.recipient}\n${physicalGift.address}`} label="Alamat pengiriman" />
              </article>
            </Reveal>
          </div>
        </section>

        {wishes.enabled ? (
          <section className="wishes-section section section--soft" aria-labelledby="wishes-title">
            <Reveal><SectionHeading eyebrow="Doa Untuk Kami" title="Ucapan & Doa" /></Reveal>
            <Reveal>
              <form className="wish-form" onSubmit={submitWish}>
                <div className="form-row">
                  <label>
                    <span>Nama</span>
                    <input required name="name" autoComplete="name" placeholder="Nama Anda" />
                  </label>
                  <label>
                    <span>Email</span>
                    <input required type="email" name="email" autoComplete="email" placeholder="email@anda.com" />
                  </label>
                </div>
                <label>
                  <span>Ucapan</span>
                  <textarea required name="message" rows={4} placeholder="Tuliskan doa dan ucapan terbaik Anda" />
                </label>
                <div className="wish-form__footer">
                  <p>{wishSent ? "Terima kasih. Ucapan Anda telah diterima." : "Ucapan Anda akan dikirimkan kepada kedua mempelai."}</p>
                  <Button type="submit" className="submit-wish">Kirim Ucapan <Send size={15} aria-hidden="true" /></Button>
                </div>
              </form>
            </Reveal>
          </section>
        ) : null}

        <section className="closing-section section section--charcoal" aria-labelledby="closing-title" style={{ backgroundImage: `url(${assets.paperDark})` }}>
          <Reveal>
            <img className="brand-mark brand-mark--closing" src={assets.mark} alt="" aria-hidden="true" />
            <p className="closing-section__message">{closing.message}</p>
            <h2 id="closing-title">{closing.signature}</h2>
            <Heart className="closing-section__heart" size={17} strokeWidth={1.25} aria-hidden="true" />
          </Reveal>
        </section>
      </div>

      <Dialog open={Boolean(selectedImage)} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="gallery-dialog">
          <DialogTitle className="sr-only">{selectedImage?.caption}</DialogTitle>
          {selectedImage ? <img src={selectedImage.image} alt={selectedImage.caption} /> : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
