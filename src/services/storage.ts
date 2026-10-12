import { 
  Post, 
  Category, 
  Comment, 
  User, 
  PushNotification, 
  Announcement, 
  ActivityEvent, 
  CommunityStats,
  UserRole
} from '../types/forum';

const STORAGE_KEYS = {
  POSTS: 'mentarimuda_posts_v2',
  CATEGORIES: 'mentarimuda_categories_v2',
  COMMENTS: 'mentarimuda_comments_v2',
  USERS: 'mentarimuda_users_v2',
  CURRENT_USER_ID: 'mentarimuda_current_user_id_v2',
  NOTIFICATIONS: 'mentarimuda_notifications_v2',
  ANNOUNCEMENTS: 'mentarimuda_announcements_v2',
  ACTIVITIES: 'mentarimuda_activities_v2',
};

// Seed Categories
const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Teknologi & Koding',
    slug: 'teknologi-koding',
    description: 'Diskusi web development, AI engineering, arsitektur software, dan tips coding modern.',
    color: 'sky',
    iconName: 'Code',
    threadCount: 14,
  },
  {
    id: 'cat-2',
    name: 'Karir & Beasiswa',
    slug: 'karir-beasiswa',
    description: 'Peluang magang, beasiswa S1/S2 dalam & luar negeri, review CV ATS, dan tips interview.',
    color: 'emerald',
    iconName: 'GraduationCap',
    threadCount: 19,
  },
  {
    id: 'cat-3',
    name: 'Kreativitas & Desain',
    slug: 'kreativitas-desain',
    description: 'UI/UX design, visual branding, claymorphism, 3D asset, dan portfolio showcase.',
    color: 'rose',
    iconName: 'Palette',
    threadCount: 8,
  },
  {
    id: 'cat-4',
    name: 'Bisnis & Startup',
    slug: 'bisnis-startup',
    description: 'Validasi ide bisnis pemuda, growth hacking, manajemen finansial, dan freelance.',
    color: 'amber',
    iconName: 'TrendingUp',
    threadCount: 11,
  },
  {
    id: 'cat-5',
    name: 'Tanya Mentor',
    slug: 'tanya-mentor',
    description: 'Tanya jawab seputar problem teknis, karir, dan bimbingan langsung dari senior komunitas.',
    color: 'purple',
    iconName: 'HelpCircle',
    threadCount: 23,
  },
  {
    id: 'cat-6',
    name: 'Cerita & Santai',
    slug: 'cerita-santai',
    description: 'Ruang ngobrol santai, sharing pengalaman kuliah/kerja, hobi, dan diskusi kasual.',
    color: 'orange',
    iconName: 'Coffee',
    threadCount: 15,
  },
];

// Seed Users
const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin_mentari',
    displayName: 'Karisma Mentari (Admin)',
    email: 'admin@mentarimuda.id',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=karisma_mentari&backgroundColor=ffd5dc,d1d4f9,c0aede',
    bio: 'Penggerak komunitas Mentarimuda. Fokus membakar semangat kolaborasi dan inovasi pemuda nusantara.',
    location: 'Jakarta, Indonesia',
    website: 'https://mentarimuda.id',
    interests: ['Community Building', 'EdTech', 'Social Innovation'],
    badges: ['Pionir Mentari', 'Admin Komunitas', 'Super Verifikasi'],
    postCount: 5,
    answerCount: 18,
    solutionsCount: 8,
    karma: 1450,
    joinedDate: '2025-01-10T08:00:00Z',
  },
  {
    id: 'user-budi',
    username: 'budi_developer',
    displayName: 'Budi Santoso',
    email: 'budi@techmail.id',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=budi_santoso&backgroundColor=b6e3f4,c0aede',
    bio: 'Frontend Engineer antusias React, TypeScript, dan Tailwind CSS. Senang berbagi solusi teknis.',
    location: 'Bandung, Indonesia',
    website: 'https://github.com/budidev',
    interests: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    badges: ['Top Kontributor', 'Pemberi Solusi', 'Tech Specialist'],
    postCount: 8,
    answerCount: 24,
    solutionsCount: 12,
    karma: 980,
    joinedDate: '2025-02-15T09:30:00Z',
  },
  {
    id: 'user-siti',
    username: 'siti_beasiswa',
    displayName: 'Siti Rahmawati',
    email: 'siti.awardee@campus.ac.id',
    role: 'moderator',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siti_rahmawati&backgroundColor=d1d4f9,ffdfbf',
    bio: 'Awardee Beasiswa LPDP 2025. Mentor essay scholarship, persiapan IELTS, dan tips interview.',
    location: 'Yogyakarta, Indonesia',
    website: 'https://linkedin.com/in/sitirahmawati',
    interests: ['Scholarship', 'Education', 'Public Speaking', 'IELTS'],
    badges: ['Mentor Teladan', 'Moderator', 'Pionir Mentari'],
    postCount: 6,
    answerCount: 19,
    solutionsCount: 9,
    karma: 1120,
    joinedDate: '2025-01-20T11:00:00Z',
  },
  {
    id: 'user-dimas',
    username: 'dimas_uiux',
    displayName: 'Dimas Ardiansyah',
    email: 'dimas@studioclay.design',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dimas_ardiansyah&backgroundColor=ffd5dc,b6e3f4',
    bio: 'Product Designer yang terobsesi dengan Claymorphism, micro-interactions, dan visual craft.',
    location: 'Surabaya, Indonesia',
    website: 'https://dribbble.com/dimasdesign',
    interests: ['Figma', 'Claymorphism', 'Design System', 'Accessibility'],
    badges: ['Kreator Visual', 'Anggota Aktif'],
    postCount: 4,
    answerCount: 7,
    solutionsCount: 3,
    karma: 430,
    joinedDate: '2025-03-01T14:15:00Z',
  },
  {
    id: 'user-guest',
    username: 'tamu_mentari',
    displayName: 'Tamu Mentari #108',
    email: 'guest@mentarimuda.id',
    role: 'guest',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest_mentari&backgroundColor=e2e8f0',
    bio: 'Pengunjung kasual di Forum Mentarimuda. Anda dapat mencoba posting atau membuat akun permanen dengan 1-klik!',
    location: 'Indonesia',
    badges: ['Pengunjung Kasual'],
    postCount: 0,
    answerCount: 0,
    solutionsCount: 0,
    karma: 10,
    joinedDate: new Date().toISOString(),
  },
];

// Seed Posts
const SEED_POSTS: Post[] = [
  {
    id: 'post-1',
    slug: 'polling-stack-web-dan-bahasa-paling-menjanjikan-2026',
    title: 'Polling: Bahasa Pemrograman atau Stack Web Paling Menjanjikan untuk Fresh Graduate 2026?',
    content: `Halo rekan-rekan Mentarimuda! Menghadapi era rekrutmen tech terkini dengan integrasi AI tools, menurut kalian keahlian coding manakah yang paling dicari perusahaan rintisan maupun enterprise untuk talenta pemuda Indonesia di tahun 2026?

Silakan berikan voting kalian di bawah dan sertakan alasan di kolom komentar untuk membantu teman-teman yang sedang bersiap magang atau lulus kuliah!`,
    type: 'polling',
    categorySlug: 'teknologi-koding',
    tags: ['Koding', 'Karir', 'WebDev', 'FreshGraduate'],
    authorId: 'user-budi',
    authorName: 'Budi Santoso',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=budi_santoso&backgroundColor=b6e3f4,c0aede',
    authorRole: 'member',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    views: 342,
    likes: 28,
    likedByUserIds: ['user-admin', 'user-siti', 'user-dimas'],
    commentCount: 4,
    isPinned: true,
    pollData: {
      question: 'Stack koding mana yang paling esensial dikuasai pemuda di 2026?',
      totalVotes: 87,
      allowMultiple: false,
      options: [
        { id: 'opt-1', text: 'TypeScript + React/Next.js & Modern CSS', voteCount: 42, voterIds: ['user-budi', 'user-dimas'] },
        { id: 'opt-2', text: 'Python + AI Agents / Data Engineering', voteCount: 26, voterIds: ['user-admin'] },
        { id: 'opt-3', text: 'Go (Golang) / Rust untuk High Performance Backend', voteCount: 13, voterIds: [] },
        { id: 'opt-4', text: 'Mobile Flutter / Kotlin Multiplatform', voteCount: 6, voterIds: [] },
      ],
    },
  },
  {
    id: 'post-2',
    slug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    title: 'Tanya: Bagaimana cara menyusun CV ATS-friendly untuk beasiswa LPDP dan magang multinasional?',
    content: `Halo semua mentor! Saya mahasiswa semester 6 yang sedang mempersiapkan diri mendaftar beasiswa LPDP tahap depan sekaligus magang di perusahaan multinasional.

Saya sering mendengar bahwa CV harus lulus screening software ATS (Applicant Tracking System). Pertanyaan saya:
1. Format template seperti apa yang paling aman (format kolom tunggal vs dua kolom)?
2. Bagaimana cara mengukur impact (metrik kuantitatif) jika pengalaman organisasi saya belum memiliki angka besar?
3. Apakah format PDF selalu terbaca dengan akurat?

Mohon masukan dan tips praktisnya!`,
    type: 'pertanyaan',
    categorySlug: 'karir-beasiswa',
    tags: ['Beasiswa', 'LPDP', 'CV-ATS', 'Karir'],
    authorId: 'user-dimas',
    authorName: 'Dimas Ardiansyah',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dimas_ardiansyah&backgroundColor=ffd5dc,b6e3f4',
    authorRole: 'member',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    views: 512,
    likes: 45,
    likedByUserIds: ['user-admin', 'user-budi', 'user-siti'],
    commentCount: 3,
    isSolved: true,
    acceptedCommentId: 'comment-siti-1',
  },
  {
    id: 'post-3',
    slug: 'membangun-side-income-dari-produk-digital-tanpa-burnout',
    title: 'Diskusi: Membangun Side-Income dari Produk Digital bagi Pemuda tanpa Terjebak Burnout',
    content: `Banyak dari kita yang ingin mulai memonetisasi skill kreatif maupun teknis di waktu luang (membuat template Figma, micro SaaS, konten edukasi, Notion templates, atau assets). Namun tantangan terbesarnya adalah konsistensi dan manajemen energi setelah seharian bekerja atau kuliah.

Berikut 3 prinsip yang saya terapkan:
1. **Aturan 45 Menit Terfokus**: Alih-alih maraton 5 jam di akhir pekan, luangkan 45 menit setiap pagi sebelum rutinitas dimulai.
2. **Reuse & Repurpose**: Jangan buat materi dari nol, dokumentasikan apa yang sedang dipelajari sehari-hari.
3. **Validasi Cepat di Komunitas**: Tanyakan langsung ke calon audiens di forum seperti Mentarimuda sebelum menghabiskan waktu berminggu-minggu membangun produk.

Bagaimana pengalaman rekan-rekan sekalian? Apa metode favorit kalian dalam menjaga produktivitas sehat?`,
    type: 'diskusi',
    categorySlug: 'bisnis-startup',
    tags: ['SideIncome', 'Produktivitas', 'DigitalProduct', 'Mindset'],
    authorId: 'user-admin',
    authorName: 'Karisma Mentari (Admin)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=karisma_mentari&backgroundColor=ffd5dc,d1d4f9,c0aede',
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    views: 670,
    likes: 62,
    likedByUserIds: ['user-budi', 'user-dimas', 'user-siti'],
    commentCount: 5,
  },
  {
    id: 'post-4',
    slug: 'polling-kebiasaan-kerja-favorit-wfa-hybrid-atau-kantor',
    title: 'Polling: Gaya Bekerja Mana yang Paling Bikin Kamu Produktif & Bahagia?',
    content: `Diskusi seputar kultur kerja masa kini: Di antara 3 model kerja berikut, mana yang menurutmu memberikan keseimbangan hidup dan akselerasi karir terbaik? Berikan suaramu!`,
    type: 'polling',
    categorySlug: 'cerita-santai',
    tags: ['WorkLife', 'WFA', 'Hybrid', 'Opini'],
    authorId: 'user-siti',
    authorName: 'Siti Rahmawati',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siti_rahmawati&backgroundColor=d1d4f9,ffdfbf',
    authorRole: 'moderator',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    views: 290,
    likes: 19,
    likedByUserIds: ['user-admin'],
    commentCount: 2,
    pollData: {
      question: 'Gaya kerja idaman generasi muda saat ini:',
      totalVotes: 64,
      allowMultiple: false,
      options: [
        { id: 'opt-wfa-1', text: '100% Remote / Work From Anywhere (Bebas lokasi)', voteCount: 39, voterIds: ['user-siti'] },
        { id: 'opt-wfa-2', text: 'Hybrid (2-3 hari kantor, sisanya fleksibel di rumah/kafe)', voteCount: 21, voterIds: ['user-admin'] },
        { id: 'opt-wfa-3', text: '100% On-site Kantor (Kolaborasi tatap muka langsung)', voteCount: 4, voterIds: [] },
      ],
    },
  },
  {
    id: 'post-5',
    slug: 'pertanyaan-cara-belajar-claymorphism-ui-di-tailwind-css',
    title: 'Tanya: Prinsip Bayangan & Inner Highlight untuk Desain Claymorphism di CSS?',
    content: `Saya sedang bereksperimen membuat antarmuka bergaya Claymorphism (kotak-kotak empuk 3D seperti mainan tanah liat). 

Namun seringkali bayangannya terlihat terlalu kotor atau flat. Apakah ada formula kombinasi drop-shadow dan inner-shadow yang pas agar terlihat halus, cerah, dan ramah di mata?`,
    type: 'pertanyaan',
    categorySlug: 'kreativitas-desain',
    tags: ['Claymorphism', 'CSS', 'UIUX', 'DesignSystem'],
    authorId: 'user-budi',
    authorName: 'Budi Santoso',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=budi_santoso&backgroundColor=b6e3f4,c0aede',
    authorRole: 'member',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    views: 420,
    likes: 31,
    likedByUserIds: ['user-dimas'],
    commentCount: 2,
    isSolved: false,
  },
];

// Seed Comments
const SEED_COMMENTS: Comment[] = [
  {
    id: 'comment-siti-1',
    postId: 'post-2',
    parentId: null,
    authorId: 'user-siti',
    authorName: 'Siti Rahmawati',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siti_rahmawati&backgroundColor=d1d4f9,ffdfbf',
    authorRole: 'moderator',
    authorBadges: ['Mentor Teladan', 'Moderator'],
    content: `Halo Dimas! Senang sekali melihat antusiasmemu. Sebagai reviewer beasiswa dan alumni penerima LPDP, ini 3 kunci utamanya:

1. **Tata Letak Satu Kolom (Single Column)**: Format 1 kolom adalah yang paling 100% aman untuk semua parser ATS. Hindari tabel tak kasat mata atau grafik progress bar skill.
2. **Rumus XYZ Google untuk Impact**: "Mencapai [X], yang diukur dengan [Y], dengan melakukan [Z]". Misalnya: *"Mengkoordinir 15 panitia dalam seminar beasiswa kampus, menjaring 450+ peserta (naik 30% dari tahun lalu) melalui kampanye media sosial terarah"*.
3. **Standar Font & Format File**: Gunakan font modern bersih (seperti Plus Jakarta Sans, Calibri, atau Arial) ukuran 10-11pt. Selalu simpan dalam format PDF standar tanpa proteksi password.

Semoga sukses persiapannya! Jika butuh review essay, bisa tag saya di kategori Tanya Mentor.`,
    createdAt: new Date(Date.now() - 3600000 * 11).toISOString(),
    likes: 38,
    likedByUserIds: ['user-dimas', 'user-budi', 'user-admin'],
    isAcceptedSolution: true,
  },
  {
    id: 'comment-dimas-reply',
    postId: 'post-2',
    parentId: 'comment-siti-1',
    authorId: 'user-dimas',
    authorName: 'Dimas Ardiansyah',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dimas_ardiansyah&backgroundColor=ffd5dc,b6e3f4',
    authorRole: 'member',
    authorBadges: ['Kreator Visual'],
    content: `Terima kasih banyak Kak Siti atas penjelasan yang sangat detail dan aplikatif! Formula XYZ Google langsung saya terapkan pada poin pengalaman organisasi saya. Saya tandai jawaban ini sebagai Jawaban Terbaik (Solusi)!`,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    likes: 12,
    likedByUserIds: ['user-siti'],
  },
  {
    id: 'comment-budi-p2',
    postId: 'post-2',
    parentId: null,
    authorId: 'user-budi',
    authorName: 'Budi Santoso',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=budi_santoso&backgroundColor=b6e3f4,c0aede',
    authorRole: 'member',
    authorBadges: ['Top Kontributor'],
    content: `Tambahan sedikit dari sisi teknis: hindari menaruh informasi penting di bagian header atau footer Microsoft Word, karena parser ATS tertentu mengabaikan area tersebut saat ekstraksi teks.`,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    likes: 14,
    likedByUserIds: ['user-dimas'],
  },
  {
    id: 'comment-admin-poll',
    postId: 'post-1',
    parentId: null,
    authorId: 'user-admin',
    authorName: 'Karisma Mentari (Admin)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=karisma_mentari&backgroundColor=ffd5dc,d1d4f9,c0aede',
    authorRole: 'admin',
    authorBadges: ['Pionir Mentari', 'Admin'],
    content: `Saya vote opsi Python + AI Agents! Sekarang banyak perusahaan yang menghargai fresh graduate yang tidak hanya paham CRUD, tapi juga mampu mengintegrasikan model AI, prompt pipeline, dan workflow automasi.`,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    likes: 19,
    likedByUserIds: ['user-budi'],
  },
  {
    id: 'comment-dimas-poll',
    postId: 'post-1',
    parentId: null,
    authorId: 'user-dimas',
    authorName: 'Dimas Ardiansyah',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dimas_ardiansyah&backgroundColor=ffd5dc,b6e3f4',
    authorRole: 'member',
    authorBadges: ['Kreator Visual'],
    content: `Saya memilih TypeScript & React/Next.js karena ekosistemnya matang dan kebutuhan industri untuk frontend interaktif tetap sangat tinggi!`,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 11,
    likedByUserIds: ['user-budi'],
  },
];

// Seed Announcements
const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Selamat Datang di Mentarimuda! Ruang Kolaborasi & Diskusi Pemuda',
    content: 'Jadikan forum ini wadah bertukar ilmu yang sehat, saling menyemangati, dan menemukan peluang kolaborasi. Nikmati fitur Polling, Q&A dengan solusi terverifikasi, dan dashboard analitik real-time!',
    type: 'success',
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

// Seed Activity Events
const SEED_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    actionText: 'memberikan vote pada Polling',
    userName: 'Budi Santoso',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=budi_santoso&backgroundColor=b6e3f4,c0aede',
    targetTitle: 'Stack Web Paling Menjanjikan 2026',
    targetSlug: 'polling-stack-web-dan-bahasa-paling-menjanjikan-2026',
    type: 'vote',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'act-2',
    actionText: 'menjawab pertanyaan dengan solusi terverifikasi pada',
    userName: 'Siti Rahmawati',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siti_rahmawati&backgroundColor=d1d4f9,ffdfbf',
    targetTitle: 'Menyusun CV ATS-friendly untuk Beasiswa LPDP',
    targetSlug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    type: 'solve',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'act-3',
    actionText: 'membuat topik diskusi baru',
    userName: 'Karisma Mentari',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=karisma_mentari&backgroundColor=ffd5dc,d1d4f9,c0aede',
    targetTitle: 'Membangun Side-Income dari Produk Digital',
    targetSlug: 'membangun-side-income-dari-produk-digital-tanpa-burnout',
    type: 'post',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'act-4',
    actionText: 'mengomentari topik',
    userName: 'Dimas Ardiansyah',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dimas_ardiansyah&backgroundColor=ffd5dc,b6e3f4',
    targetTitle: 'Stack Web Paling Menjanjikan 2026',
    targetSlug: 'polling-stack-web-dan-bahasa-paling-menjanjikan-2026',
    type: 'comment',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

// Seed Initial Notifications
const SEED_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    recipientId: 'user-dimas',
    senderName: 'Siti Rahmawati',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=siti_rahmawati&backgroundColor=d1d4f9,ffdfbf',
    type: 'comment',
    title: 'Jawaban Baru di Pertanyaan Anda',
    message: 'Siti Rahmawati memberikan panduan lengkap mengenai CV ATS-friendly.',
    targetSlug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    createdAt: new Date(Date.now() - 3600000 * 11).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    recipientId: 'user-siti',
    senderName: 'Dimas Ardiansyah',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dimas_ardiansyah&backgroundColor=ffd5dc,b6e3f4',
    type: 'best_answer',
    title: 'Solusi Diterima!',
    message: 'Jawaban Anda ditandai sebagai Jawaban Terbaik oleh penanya. Anda mendapatkan +50 Poin Mentari!',
    targetSlug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    recipientId: 'user-budi',
    senderName: 'Karisma Mentari',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=karisma_mentari&backgroundColor=ffd5dc,d1d4f9,c0aede',
    type: 'poll_vote',
    title: 'Voting Baru di Polling Anda',
    message: 'Karisma Mentari memberikan suara pada opsi Python + AI Agents.',
    targetSlug: 'polling-stack-web-dan-bahasa-paling-menjanjikan-2026',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: true,
  },
];

// Event listener for cross-component and cross-tab reactive updates
const FORUM_EVENT_NAME = 'mentarimuda_state_update';

export function notifyStateChange(eventType?: string, payload?: unknown) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(FORUM_EVENT_NAME, { detail: { eventType, payload } }));
  }
}

export function subscribeToStateChange(callback: (event: CustomEvent) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => callback(e as CustomEvent);
  window.addEventListener(FORUM_EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(FORUM_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

// Storage helpers
export const storageService = {
  // Initialization
  init(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      // Default to Dimas or Admin for an active experience
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-dimas');
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    }
  },

  // USERS
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  },

  getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-dimas';
    const found = users.find(u => u.id === currentId);
    if (found) return found;
    return users[0] || SEED_USERS[0];
  },

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    notifyStateChange('user_switched', userId);
  },

  createUser(userData: Partial<User>): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username || `user_${Date.now().toString().slice(-4)}`,
      displayName: userData.displayName || 'Anggota Mentari',
      email: userData.email || `${userData.username}@mentari.id`,
      role: userData.role || 'member',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.username || Date.now()}&backgroundColor=b6e3f4,ffd5dc`,
      bio: userData.bio || 'Semangat belajar dan bertukar wawasan di Mentarimuda.',
      location: userData.location || 'Indonesia',
      website: userData.website || '',
      interests: userData.interests || ['Diskusi', 'Kolaborasi'],
      badges: ['Anggota Baru'],
      postCount: 0,
      answerCount: 0,
      solutionsCount: 0,
      karma: 50,
      joinedDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser.id);
    this.logActivity('bergabung sebagai anggota baru komunitas', newUser.displayName, newUser.avatar, 'Mentarimuda Community', '', 'post');
    notifyStateChange('user_created', newUser);
    return newUser;
  },

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyStateChange('profile_updated', users[idx]);
    return users[idx];
  },

  toggleBanUser(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    user.isBanned = !user.isBanned;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyStateChange('user_banned_toggled', user);
    return !!user.isBanned;
  },

  changeUserRole(userId: string, newRole: UserRole): void {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    user.role = newRole;
    if (newRole === 'moderator' && !user.badges.includes('Moderator')) {
      user.badges.push('Moderator');
    }
    if (newRole === 'admin' && !user.badges.includes('Admin Komunitas')) {
      user.badges.push('Admin Komunitas');
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyStateChange('user_role_changed', user);
  },

  // CATEGORIES
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : SEED_CATEGORIES;
    } catch {
      return SEED_CATEGORIES;
    }
  },

  saveCategory(cat: Omit<Category, 'id' | 'threadCount'> & { id?: string }): Category {
    const categories = this.getCategories();
    if (cat.id) {
      const idx = categories.findIndex(c => c.id === cat.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...cat };
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        notifyStateChange('category_updated', categories[idx]);
        return categories[idx];
      }
    }

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      color: cat.color || 'amber',
      iconName: cat.iconName || 'Hash',
      threadCount: 0,
    };
    categories.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifyStateChange('category_created', newCat);
    return newCat;
  },

  deleteCategory(catId: string): void {
    const categories = this.getCategories().filter(c => c.id !== catId);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifyStateChange('category_deleted', catId);
  },

  // POSTS
  getPosts(): Post[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      const posts: Post[] = data ? JSON.parse(data) : SEED_POSTS;
      // Sort pinned first, then newest
      return posts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } catch {
      return SEED_POSTS;
    }
  },

  getPostBySlug(slug: string): Post | undefined {
    const posts = this.getPosts();
    return posts.find(p => p.slug === slug);
  },

  createPost(postData: Omit<Post, 'id' | 'createdAt' | 'views' | 'likes' | 'likedByUserIds' | 'commentCount'>): Post {
    const posts = this.getPosts();
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 1,
      likes: 1,
      likedByUserIds: [postData.authorId],
      commentCount: 0,
    };

    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    // Increment user post count
    const users = this.getUsers();
    const author = users.find(u => u.id === postData.authorId);
    if (author) {
      author.postCount = (author.postCount || 0) + 1;
      author.karma = (author.karma || 0) + 15;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Increment category threadCount
    const categories = this.getCategories();
    const cat = categories.find(c => c.slug === postData.categorySlug);
    if (cat) {
      cat.threadCount = (cat.threadCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    // Log Activity
    this.logActivity(
      postData.type === 'polling' ? 'membuat polling interaktif' : postData.type === 'pertanyaan' ? 'mengajukan pertanyaan' : 'memulai diskusi baru',
      postData.authorName,
      postData.authorAvatar,
      newPost.title,
      newPost.slug,
      'post'
    );

    // Push Notification to all users
    this.createNotification({
      recipientId: 'all',
      senderName: postData.authorName,
      senderAvatar: postData.authorAvatar,
      type: postData.type === 'polling' ? 'poll_vote' : 'comment',
      title: `Topik Baru: ${newPost.title}`,
      message: `${postData.authorName} baru saja membagikan ${postData.type} baru. Klik untuk bergabung!`,
      targetSlug: newPost.slug,
    });

    notifyStateChange('post_created', newPost);
    return newPost;
  },

  incrementPostViews(slug: string): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.slug === slug);
    if (post) {
      post.views = (post.views || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      notifyStateChange('post_viewed', post);
    }
  },

  toggleLikePost(postId: string, userId: string): boolean {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return false;

    post.likedByUserIds = post.likedByUserIds || [];
    const hasLiked = post.likedByUserIds.includes(userId);

    const currentUser = this.getCurrentUser();

    if (hasLiked) {
      post.likedByUserIds = post.likedByUserIds.filter(id => id !== userId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedByUserIds.push(userId);
      post.likes = (post.likes || 0) + 1;

      // Notify post author if not self
      if (post.authorId !== userId) {
        this.createNotification({
          recipientId: post.authorId,
          senderName: currentUser.displayName,
          senderAvatar: currentUser.avatar,
          type: 'upvote',
          title: 'Apresiasi Topik Anda',
          message: `${currentUser.displayName} menyukai postingan Anda: "${post.title.slice(0, 40)}..."`,
          targetSlug: post.slug,
        });
      }
    }

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    notifyStateChange('post_liked', { postId, hasLiked: !hasLiked });
    return !hasLiked;
  },

  togglePinPost(postId: string): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.isPinned = !post.isPinned;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      notifyStateChange('post_pinned_toggled', post);
    }
  },

  toggleLockPost(postId: string): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.isLocked = !post.isLocked;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      notifyStateChange('post_locked_toggled', post);
    }
  },

  deletePost(postId: string): void {
    let posts = this.getPosts();
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    notifyStateChange('post_deleted', postId);
  },

  // POLL VOTING
  votePoll(postId: string, optionId: string, userId: string): boolean {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.pollData) return false;

    // Check if user already voted in this poll
    let alreadyVoted = false;
    post.pollData.options.forEach(opt => {
      if (opt.voterIds.includes(userId)) {
        alreadyVoted = true;
      }
    });

    if (alreadyVoted && !post.pollData.allowMultiple) {
      return false; // Already voted
    }

    const targetOpt = post.pollData.options.find(opt => opt.id === optionId);
    if (!targetOpt) return false;

    targetOpt.voterIds.push(userId);
    targetOpt.voteCount += 1;
    post.pollData.totalVotes += 1;

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    const currentUser = this.getCurrentUser();
    this.logActivity(
      'memberikan suara pada polling',
      currentUser.displayName,
      currentUser.avatar,
      post.title,
      post.slug,
      'vote'
    );

    // Notify author
    if (post.authorId !== userId) {
      this.createNotification({
        recipientId: post.authorId,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.avatar,
        type: 'poll_vote',
        title: 'Suara Baru di Polling Anda',
        message: `${currentUser.displayName} memilih opsi "${targetOpt.text.slice(0, 30)}..." pada polling Anda.`,
        targetSlug: post.slug,
      });
    }

    notifyStateChange('poll_voted', { postId, optionId, userId });
    return true;
  },

  // COMMENTS
  getComments(postId?: string): Comment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const comments: Comment[] = data ? JSON.parse(data) : SEED_COMMENTS;
      if (postId) {
        return comments.filter(c => c.postId === postId);
      }
      return comments;
    } catch {
      return SEED_COMMENTS;
    }
  },

  addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'likedByUserIds' | 'isAcceptedSolution'>): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByUserIds: [],
      isAcceptedSolution: false,
    };

    comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

    // Update post comment count
    const posts = this.getPosts();
    const post = posts.find(p => p.id === commentData.postId);
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      // Notify post author
      if (post.authorId !== commentData.authorId) {
        this.createNotification({
          recipientId: post.authorId,
          senderName: commentData.authorName,
          senderAvatar: commentData.authorAvatar,
          type: 'comment',
          title: 'Komentar Baru di Topik Anda',
          message: `${commentData.authorName} menanggapi: "${newComment.content.slice(0, 50)}..."`,
          targetSlug: post.slug,
        });
      }

      this.logActivity(
        'mengomentari diskusi',
        commentData.authorName,
        commentData.authorAvatar,
        post.title,
        post.slug,
        'comment'
      );
    }

    // Increment user answer/comment count
    const users = this.getUsers();
    const author = users.find(u => u.id === commentData.authorId);
    if (author) {
      author.answerCount = (author.answerCount || 0) + 1;
      author.karma = (author.karma || 0) + 5;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    notifyStateChange('comment_added', newComment);
    return newComment;
  },

  toggleLikeComment(commentId: string, userId: string): boolean {
    const comments = this.getComments();
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return false;

    comment.likedByUserIds = comment.likedByUserIds || [];
    const hasLiked = comment.likedByUserIds.includes(userId);

    if (hasLiked) {
      comment.likedByUserIds = comment.likedByUserIds.filter(id => id !== userId);
      comment.likes = Math.max(0, (comment.likes || 1) - 1);
    } else {
      comment.likedByUserIds.push(userId);
      comment.likes = (comment.likes || 0) + 1;
    }

    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    notifyStateChange('comment_liked', { commentId, hasLiked: !hasLiked });
    return !hasLiked;
  },

  markAcceptedSolution(postId: string, commentId: string): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comments = this.getComments();
    const targetComment = comments.find(c => c.id === commentId);
    if (!targetComment) return;

    // Reset previous solution for this post
    comments.forEach(c => {
      if (c.postId === postId) {
        c.isAcceptedSolution = (c.id === commentId);
      }
    });

    post.isSolved = true;
    post.acceptedCommentId = commentId;

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

    // Award bonus karma to solution author
    const users = this.getUsers();
    const solutionAuthor = users.find(u => u.id === targetComment.authorId);
    if (solutionAuthor) {
      solutionAuthor.solutionsCount = (solutionAuthor.solutionsCount || 0) + 1;
      solutionAuthor.karma = (solutionAuthor.karma || 0) + 50;
      if (!solutionAuthor.badges.includes('Pemberi Solusi')) {
        solutionAuthor.badges.push('Pemberi Solusi');
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Notify solution author
    this.createNotification({
      recipientId: targetComment.authorId,
      senderName: post.authorName,
      senderAvatar: post.authorAvatar,
      type: 'best_answer',
      title: '🎉 Jawaban Anda Diterima!',
      message: `Jawaban Anda pada "${post.title.slice(0, 40)}..." telah ditandai sebagai Jawaban Terbaik (+50 Poin Mentari)!`,
      targetSlug: post.slug,
    });

    this.logActivity(
      'menandai jawaban terbaik pada',
      post.authorName,
      post.authorAvatar,
      post.title,
      post.slug,
      'solve'
    );

    notifyStateChange('solution_accepted', { postId, commentId });
  },

  deleteComment(commentId: string): void {
    let comments = this.getComments();
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      const postId = comment.postId;
      comments = comments.filter(c => c.id !== commentId && c.parentId !== commentId);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

      // Update post comment count
      const posts = this.getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.commentCount = comments.filter(c => c.postId === postId).length;
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      }

      notifyStateChange('comment_deleted', commentId);
    }
  },

  // NOTIFICATIONS
  getNotifications(userId?: string): PushNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const notifs: PushNotification[] = data ? JSON.parse(data) : SEED_NOTIFICATIONS;
      if (userId) {
        return notifs.filter(n => n.recipientId === userId || n.recipientId === 'all')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return SEED_NOTIFICATIONS;
    }
  },

  createNotification(notifData: Omit<PushNotification, 'id' | 'createdAt' | 'read'>): PushNotification {
    const notifs = this.getNotifications();
    const newNotif: PushNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));

    notifyStateChange('push_notification', newNotif);
    return newNotif;
  },

  markNotificationRead(notifId: string): void {
    const notifs = this.getNotifications();
    const notif = notifs.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      notifyStateChange('notification_read', notifId);
    }
  },

  markAllNotificationsRead(userId: string): void {
    const notifs = this.getNotifications();
    notifs.forEach(n => {
      if (n.recipientId === userId || n.recipientId === 'all') {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    notifyStateChange('all_notifications_read', userId);
  },

  clearNotifications(userId: string): void {
    let notifs = this.getNotifications();
    notifs = notifs.filter(n => n.recipientId !== userId && n.recipientId !== 'all');
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    notifyStateChange('notifications_cleared', userId);
  },

  // ANNOUNCEMENTS
  getAnnouncements(): Announcement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return data ? JSON.parse(data) : SEED_ANNOUNCEMENTS;
    } catch {
      return SEED_ANNOUNCEMENTS;
    }
  },

  saveAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'> & { id?: string }): Announcement {
    const announcements = this.getAnnouncements();
    if (ann.id) {
      const idx = announcements.findIndex(a => a.id === ann.id);
      if (idx !== -1) {
        announcements[idx] = { ...announcements[idx], ...ann };
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
        notifyStateChange('announcement_updated', announcements[idx]);
        return announcements[idx];
      }
    }

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: ann.title,
      content: ann.content,
      type: ann.type || 'info',
      active: ann.active ?? true,
      createdAt: new Date().toISOString(),
    };
    announcements.unshift(newAnn);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    notifyStateChange('announcement_created', newAnn);
    return newAnn;
  },

  deleteAnnouncement(annId: string): void {
    const announcements = this.getAnnouncements().filter(a => a.id !== annId);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    notifyStateChange('announcement_deleted', annId);
  },

  // ACTIVITIES & ANALYTICS
  getActivityEvents(): ActivityEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : SEED_ACTIVITIES;
    } catch {
      return SEED_ACTIVITIES;
    }
  },

  logActivity(actionText: string, userName: string, userAvatar: string, targetTitle: string, targetSlug: string, type: ActivityEvent['type']): void {
    const activities = this.getActivityEvents();
    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      actionText,
      userName,
      userAvatar,
      targetTitle,
      targetSlug,
      type,
      timestamp: new Date().toISOString(),
    };
    activities.unshift(newAct);
    // Keep last 30 activities
    const sliced = activities.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(sliced));
    notifyStateChange('activity_logged', newAct);
  },

  getCommunityStats(): CommunityStats {
    const posts = this.getPosts();
    const comments = this.getComments();
    const users = this.getUsers();

    let totalVotes = 0;
    posts.forEach(p => {
      if (p.pollData) totalVotes += p.pollData.totalVotes;
    });

    const questions = posts.filter(p => p.type === 'pertanyaan');
    const solvedQuestions = questions.filter(p => p.isSolved);
    const solvedRate = questions.length > 0 ? Math.round((solvedQuestions.length / questions.length) * 100) : 100;

    // Simulated weekly distribution based on real counts
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const weeklyActivity = days.map((day, idx) => ({
      day,
      posts: Math.max(1, Math.floor((posts.length / 5) * (1 + (idx % 3) * 0.4))),
      comments: Math.max(2, Math.floor((comments.length / 4) * (1 + ((idx + 1) % 3) * 0.5))),
      votes: Math.max(3, Math.floor((totalVotes / 4) * (1 + ((idx + 2) % 4) * 0.3))),
    }));

    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      totalVotes,
      activeMembers: users.filter(u => !u.isBanned).length,
      solvedRate,
      weeklyActivity,
    };
  },

  // BACKUP & RESET
  exportDataJson(): string {
    const dump = {
      posts: this.getPosts(),
      categories: this.getCategories(),
      comments: this.getComments(),
      users: this.getUsers(),
      announcements: this.getAnnouncements(),
      notifications: this.getNotifications(),
      exportedAt: new Date().toISOString(),
      appName: 'Mentarimuda Forum',
    };
    return JSON.stringify(dump, null, 2);
  },

  importDataJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.posts && Array.isArray(data.posts)) {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(data.posts));
      }
      if (data.categories && Array.isArray(data.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      }
      if (data.comments && Array.isArray(data.comments)) {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(data.comments));
      }
      if (data.users && Array.isArray(data.users)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      }
      if (data.announcements && Array.isArray(data.announcements)) {
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(data.announcements));
      }
      notifyStateChange('data_imported');
      return true;
    } catch {
      return false;
    }
  },

  resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-dimas');
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    notifyStateChange('data_reset');
  },

  // SIMULATOR FOR REAL-TIME PUSH NOTIFICATION DEMO
  simulateRandomInteraction(): PushNotification {
    const users = this.getUsers();
    const posts = this.getPosts();
    const currentUser = this.getCurrentUser();

    const otherUsers = users.filter(u => u.id !== currentUser.id && u.role !== 'guest');
    const randomActor = otherUsers[Math.floor(Math.random() * otherUsers.length)] || users[0];
    const randomPost = posts[Math.floor(Math.random() * posts.length)] || posts[0];

    const interactionTypes: { type: PushNotification['type']; title: string; message: string }[] = [
      {
        type: 'comment',
        title: 'Komentar Baru Diterima!',
        message: `${randomActor.displayName} memberikan opini menarik pada "${randomPost.title.slice(0, 35)}..."`,
      },
      {
        type: 'upvote',
        title: 'Apresiasi Topik Komunitas',
        message: `${randomActor.displayName} baru saja memberikan upvote pada postingan Anda!`,
      },
      {
        type: 'poll_vote',
        title: 'Suara Baru Masuk ke Polling',
        message: `${randomActor.displayName} ikut memberikan suara pada topik hangat "${randomPost.title.slice(0, 30)}..."`,
      },
    ];

    const pick = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];

    const notif = this.createNotification({
      recipientId: currentUser.id,
      senderName: randomActor.displayName,
      senderAvatar: randomActor.avatar,
      type: pick.type,
      title: pick.title,
      message: pick.message,
      targetSlug: randomPost.slug,
    });

    this.logActivity(
      pick.type === 'comment' ? 'menambahkan komentar pada' : pick.type === 'poll_vote' ? 'memilih opsi polling pada' : 'menyukai postingan',
      randomActor.displayName,
      randomActor.avatar,
      randomPost.title,
      randomPost.slug,
      pick.type === 'comment' ? 'comment' : pick.type === 'poll_vote' ? 'vote' : 'post'
    );

    return notif;
  },
};
