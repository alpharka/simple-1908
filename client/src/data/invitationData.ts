/**
 * Design reminder: this data module preserves the supplied MenikahSudahDekat
 * property names for the Simple Minimalist editorial invitation preview.
 */

export type InvitationEvent = {
  title: string;
  date: string;
  time: string;
  timezone?: string;
  venue: string;
  address: string;
  googleMaps: string;
};

export const invitationData = {
  couple: {
    bride: {
      fullName: "Putri Maharani",
      nickname: "Putri",
      father: "Bapak Ahmad Prasetyo",
      mother: "Ibu Siti Rahmawati",
      instagram: "putrimaharani",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    },
    groom: {
      fullName: "Rizky Pratama",
      nickname: "Rizky",
      father: "Bapak Bambang Setiawan",
      mother: "Ibu Lina Kartika",
      instagram: "rizkypratama",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
  },
  guest: {
    name: "Bapak / Ibu / Saudara / Saudari",
  },
  cover: {
    title: "The Wedding Of",
    subtitle: "Putri & Rizky",
    backgroundImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    backgroundMusic: "https://example.com/audio/wedding-theme.mp3",
  },
  events: {
    ceremony: {
      title: "Akad Nikah",
      date: "2027-12-12",
      time: "08:00 WIB",
      venue: "Masjid Agung Yogyakarta",
      address: "Jl. Kauman, Yogyakarta",
      googleMaps: "https://maps.app.goo.gl/N1R75E8KzNZpF4TW9",
    },
    reception: {
      title: "Resepsi",
      date: "2027-12-12",
      time: "11:00 WIB",
      venue: "Ballroom Grand Mercure Yogyakarta",
      address: "Jl. Laksda Adisucipto No.80, Yogyakarta",
      googleMaps: "https://maps.app.goo.gl/N1R75E8KzNZpF4TW9",
    },
  },
  rsvp: {
    enabled: true,
    deadline: "2027-12-05",
  },
  stories: [
    {
      title: "First Meet",
      description: "Kami pertama kali bertemu pada tahun 2021 dan memulai perjalanan yang penuh cerita.",
      date: "2021",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    },
    {
      title: "Engagement",
      description: "Setelah melalui banyak momen indah, kami memutuskan untuk melangkah ke jenjang yang lebih serius.",
      date: "2026",
      photo: "https://images.unsplash.com/photo-1529636798458-92182e662485",
    },
  ],
  gallery: [
    {
      image: "https://images.unsplash.com/photo-1519741497674-611481863552",
      caption: "Prewedding",
    },
    {
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
      caption: "Together",
    },
  ],
  videos: [
    {
      title: "Prewedding Film",
      youtubeUrl: "https://www.youtube.com/watch?v=vgufOxMfxPQ",
    },
    {
      title: "Engagement Highlight",
      youtubeUrl: "https://www.youtube.com/watch?v=-JuWZVGXgIs",
    },
  ],
  livestream: {
    youtubeUrl: "https://www.youtube.com/watch?v=tgFh6sTWcjU",
  },
  gifts: [
    {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Putri Maharani",
    },
  ],
  physicalGift: {
    recipient: "Putri Maharani",
    address: "Jl. Contoh No.123, Yogyakarta",
  },
  wishes: {
    enabled: true,
  },
  closing: {
    message: "Atas kehadiran dan doa restu yang diberikan, kami mengucapkan terima kasih.",
    signature: "Putri & Rizky",
  },
} as const;
