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
  POSTS: 'mentarimuda_posts_v5',
  CATEGORIES: 'mentarimuda_categories_v5',
  COMMENTS: 'mentarimuda_comments_v5',
  USERS: 'mentarimuda_users_v5',
  CURRENT_USER_ID: 'mentarimuda_current_user_id_v5',
  NOTIFICATIONS: 'mentarimuda_notifications_v5',
  ANNOUNCEMENTS: 'mentarimuda_announcements_v5',
  ACTIVITIES: 'mentarimuda_activities_v5',
};

// Seed Categories
const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Teknologi & Koding',
    slug: 'teknologi-koding',
    description: 'Web development, AI engineering, arsitektur software, dan tips coding modern.',
    color: 'sky',
    iconName: 'Code',
    threadCount: 0,
  },
  {
    id: 'cat-2',
    name: 'Karir & Beasiswa',
    slug: 'karir-beasiswa',
    description: 'Peluang magang, beasiswa S1/S2, review CV ATS, dan persiapan wawancara.',
    color: 'emerald',
    iconName: 'GraduationCap',
    threadCount: 0,
  },
  {
    id: 'cat-3',
    name: 'Kreativitas & Desain',
    slug: 'kreativitas-desain',
    description: 'UI/UX design, visual branding, claymorphism, 3D asset, dan portfolio showcase.',
    color: 'rose',
    iconName: 'Palette',
    threadCount: 0,
  },
  {
    id: 'cat-4',
    name: 'Bisnis & Startup',
    slug: 'bisnis-startup',
    description: 'Validasi ide bisnis pemuda, growth hacking, finansial, dan freelance.',
    color: 'amber',
    iconName: 'TrendingUp',
    threadCount: 0,
  },
  {
    id: 'cat-5',
    name: 'Tanya Mentor',
    slug: 'tanya-mentor',
    description: 'Tanya jawab seputar problem teknis, karir, dan bimbingan langsung mentor.',
    color: 'purple',
    iconName: 'HelpCircle',
    threadCount: 0,
  },
  {
    id: 'cat-6',
    name: 'Cerita & Santai',
    slug: 'cerita-santai',
    description: 'Ruang ngobrol santai, sharing pengalaman, hobi, dan diskusi kasual.',
    color: 'orange',
    iconName: 'Coffee',
    threadCount: 0,
  },
];

// Single Admin User as specified by the user
const ADMIN_USER: User = {
  id: 'user-admin',
  username: 'naufalmuhammadalhikam',
  displayName: 'Naufal Muhammad Al Hikam',
  email: 'naufalmuhammadalhikam@mentarimuda.id',
  password: 'Sowx3n713204***',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=naufalmuhammadalhikam&backgroundColor=ffd5dc,d1d4f9,c0aede',
  bio: 'Founder & Administrator Komunitas Mentarimuda. Fokus pada inovasi teknologi pemuda, kolaborasi riset, dan ekosistem digital nusantara.',
  location: 'Indonesia',
  website: 'https://mentarimuda.id',
  interests: ['Tech Leadership', 'Fullstack Web', 'Youth Empowerment', 'AI Engineering'],
  badges: ['Founder Mentarimuda', 'Admin Utama', 'Pionir Komunitas', 'Verifikasi Resmi'],
  postCount: 5,
  answerCount: 15,
  solutionsCount: 6,
  karma: 2850,
  joinedDate: '2025-01-01T00:00:00Z',
};

// Default Guest User for casual visits
const GUEST_USER: User = {
  id: 'user-guest',
  username: 'tamu_mentari',
  displayName: 'Tamu Mentari',
  email: 'guest@mentarimuda.id',
  role: 'guest',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest_mentari&backgroundColor=e2e8f0',
  bio: 'Pengunjung kasual di Forum Mentarimuda. Anda dapat membaca, voting, dan berkomentar dengan mode tamu, atau mendaftar akun.',
  location: 'Indonesia',
  badges: ['Pengunjung Kasual'],
  postCount: 0,
  answerCount: 0,
  solutionsCount: 0,
  karma: 10,
  joinedDate: new Date().toISOString(),
};

// Only Admin and Guest exist by default
const SEED_USERS: User[] = [ADMIN_USER, GUEST_USER];

// Seed Posts — All authored by Admin (Naufal Muhammad Al Hikam)
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
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    views: 420,
    likes: 35,
    likedByUserIds: [ADMIN_USER.id],
    commentCount: 2,
    isPinned: true,
    pollData: {
      question: 'Stack koding mana yang paling esensial dikuasai pemuda di 2026?',
      totalVotes: 98,
      allowMultiple: false,
      options: [
        { id: 'opt-1', text: 'TypeScript + React/Next.js & Modern CSS', voteCount: 48, voterIds: [ADMIN_USER.id] },
        { id: 'opt-2', text: 'Python + AI Agents / Data Engineering', voteCount: 31, voterIds: [] },
        { id: 'opt-3', text: 'Go (Golang) / Rust untuk High Performance Backend', voteCount: 14, voterIds: [] },
        { id: 'opt-4', text: 'Mobile Flutter / Kotlin Multiplatform', voteCount: 5, voterIds: [] },
      ],
    },
  },
  {
    id: 'post-2',
    slug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    title: 'Tanya: Bagaimana cara menyusun CV ATS-friendly untuk beasiswa LPDP dan magang multinasional?',
    content: `Halo rekan-rekan Mentarimuda! Bagi kalian yang sedang mempersiapkan diri mendaftar beasiswa LPDP maupun magang di institusi multinasional, salah satu filter awal adalah screening Applicant Tracking System (ATS).

Poin penting yang sering menjadi pertanyaan:
1. Format template seperti apa yang paling aman (format single column vs dua kolom)?
2. Bagaimana cara mengukur impact (metrik kuantitatif) jika pengalaman organisasi belum memiliki data angka besar?
3. Apakah format PDF selalu terbaca akurat oleh semua parser?

Simak pembahasan dan solusi terverifikasi di bawah ini!`,
    type: 'pertanyaan',
    categorySlug: 'karir-beasiswa',
    tags: ['Beasiswa', 'LPDP', 'CV-ATS', 'Karir'],
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    views: 590,
    likes: 54,
    likedByUserIds: [ADMIN_USER.id],
    commentCount: 2,
    isSolved: true,
    acceptedCommentId: 'comment-admin-solusi',
  },
  {
    id: 'post-3',
    slug: 'membangun-side-income-dari-produk-digital-tanpa-burnout',
    title: 'Diskusi: Membangun Side-Income dari Produk Digital bagi Pemuda tanpa Terjebak Burnout',
    content: `Banyak pemuda yang ingin mulai memonetisasi keterampilan kreatif maupun teknis di waktu luang (membuat template, micro-SaaS, konten edukasi, Notion templates, atau assets digital). Namun tantangan terbesarnya adalah konsistensi dan manajemen energi setelah seharian bekerja atau kuliah.

Berikut 3 prinsip utama yang saya terapkan di komunitas Mentarimuda:
1. **Aturan 45 Menit Terfokus**: Alih-alih maraton 5 jam di akhir pekan, luangkan 45 menit setiap pagi sebelum rutinitas harian dimulai.
2. **Reuse & Repurpose**: Jangan buat materi dari nol, dokumentasikan apa yang sedang kamu pelajari sehari-hari.
3. **Validasi Cepat di Komunitas**: Tanyakan langsung ke calon audiens di forum seperti Mentarimuda sebelum menghabiskan waktu berminggu-minggu membangun produk.

Bagaimana pengalaman rekan-rekan sekalian? Apa metode favorit kalian dalam menjaga produktivitas sehat?`,
    type: 'diskusi',
    categorySlug: 'bisnis-startup',
    tags: ['SideIncome', 'Produktivitas', 'DigitalProduct', 'Mindset'],
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    views: 730,
    likes: 68,
    likedByUserIds: [ADMIN_USER.id],
    commentCount: 1,
  },
  {
    id: 'post-4',
    slug: 'polling-kebiasaan-kerja-favorit-wfa-hybrid-atau-kantor',
    title: 'Polling: Gaya Bekerja Mana yang Paling Bikin Kamu Produktif & Bahagia?',
    content: `Diskusi seputar kultur kerja masa kini: Di antara 3 model kerja berikut, mana yang menurutmu memberikan keseimbangan hidup dan akselerasi karir terbaik bagi generasi muda? Berikan suaramu!`,
    type: 'polling',
    categorySlug: 'cerita-santai',
    tags: ['WorkLife', 'WFA', 'Hybrid', 'Opini'],
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    views: 310,
    likes: 24,
    likedByUserIds: [ADMIN_USER.id],
    commentCount: 1,
    pollData: {
      question: 'Gaya kerja idaman generasi muda saat ini:',
      totalVotes: 75,
      allowMultiple: false,
      options: [
        { id: 'opt-wfa-1', text: '100% Remote / Work From Anywhere (Bebas lokasi)', voteCount: 46, voterIds: [ADMIN_USER.id] },
        { id: 'opt-wfa-2', text: 'Hybrid (2-3 hari kantor, sisanya fleksibel di rumah/kafe)', voteCount: 24, voterIds: [] },
        { id: 'opt-wfa-3', text: '100% On-site Kantor (Kolaborasi tatap muka langsung)', voteCount: 5, voterIds: [] },
      ],
    },
  },
  {
    id: 'post-5',
    slug: 'pertanyaan-cara-belajar-claymorphism-ui-di-tailwind-css',
    title: 'Tanya: Prinsip Bayangan & Inner Highlight untuk Desain Claymorphism di CSS?',
    content: `Dalam mendesain antarmuka bergaya Claymorphism (kotak-kotak empuk 3D seperti mainan tanah liat), kunci utamanya terletak pada perpaduan dua lapis bayangan:

1. Drop-shadow luar yang lembut dan menyebar.
2. Inner highlight di sudut kiri-atas dipadukan rim shadow di sudut kanan-bawah.

Apakah rekan-rekan memiliki trik CSS khusus untuk mengoptimalkan performa rendering grafis clay pada browser mobile?`,
    type: 'pertanyaan',
    categorySlug: 'kreativitas-desain',
    tags: ['Claymorphism', 'CSS', 'UIUX', 'DesignSystem'],
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    views: 460,
    likes: 42,
    likedByUserIds: [ADMIN_USER.id],
    commentCount: 1,
    isSolved: false,
  },
];

// Seed Comments
const SEED_COMMENTS: Comment[] = [
  {
    id: 'comment-admin-solusi',
    postId: 'post-2',
    parentId: null,
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    authorBadges: ['Founder Mentarimuda', 'Admin Utama'],
    content: `Panduan resmi penyusunan CV ATS untuk seleksi beasiswa dan magang:

1. **Tata Letak Single Column**: Format 1 kolom adalah standar paling aman untuk semua parser ATS. Hindari tabel tak kasat mata atau grafik level skill.
2. **Formula Google XYZ**: "Mencapai [X], diukur dengan [Y], dengan melakukan [Z]". Contoh: "Mengkoordinasi 15 anggota tim dalam program mentoring, meningkatkan kepuasan peserta sebesar 28% melalui kurikulum terstruktur".
3. **Format & Font Standar**: Gunakan font bersih (Plus Jakarta Sans, Calibri, atau Arial) ukuran 10-11pt dan simpan sebagai file PDF standar.`,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    likes: 29,
    likedByUserIds: [ADMIN_USER.id],
    isAcceptedSolution: true,
  },
  {
    id: 'comment-guest-1',
    postId: 'post-2',
    parentId: 'comment-admin-solusi',
    authorId: 'user-guest',
    authorName: 'Tamu Mentari',
    authorAvatar: GUEST_USER.avatar,
    authorRole: 'guest',
    authorBadges: ['Pengunjung Kasual'],
    content: 'Terima kasih atas panduannya, Admin Naufal! Formula Google XYZ sangat aplikatif dan membantu sekali.',
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    likes: 7,
    likedByUserIds: [ADMIN_USER.id],
  },
  {
    id: 'comment-admin-poll',
    postId: 'post-1',
    parentId: null,
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    authorBadges: ['Founder Mentarimuda', 'Admin Utama'],
    content: 'Kombinasi TypeScript + React/Next.js tetap menjadi fondasi yang kokoh, sementara kemampuan mengintegrasikan AI Agent menjadi akselerator nilai tambah yang sangat dicari industri.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    likes: 18,
    likedByUserIds: [ADMIN_USER.id],
  },
  {
    id: 'comment-admin-prod',
    postId: 'post-3',
    parentId: null,
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    authorBadges: ['Founder Mentarimuda'],
    content: 'Kuncinya adalah jangan menunggu produk sempurna. Rilis versi minimal, mintalah masukan komunitas, dan iterasi secara bertahap.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    likes: 12,
    likedByUserIds: [],
  },
  {
    id: 'comment-guest-wfa',
    postId: 'post-4',
    parentId: null,
    authorId: 'user-guest',
    authorName: 'Tamu Mentari',
    authorAvatar: GUEST_USER.avatar,
    authorRole: 'guest',
    authorBadges: ['Pengunjung Kasual'],
    content: 'Saya vote 100% Remote! Sangat menghemat waktu perjalanan dan energi untuk berkarya.',
    createdAt: new Date(Date.now() - 3600000 * 25).toISOString(),
    likes: 6,
    likedByUserIds: [],
  },
  {
    id: 'comment-admin-clay',
    postId: 'post-5',
    parentId: null,
    authorId: ADMIN_USER.id,
    authorName: ADMIN_USER.displayName,
    authorAvatar: ADMIN_USER.avatar,
    authorRole: 'admin',
    authorBadges: ['Founder Mentarimuda'],
    content: 'Gunakan will-change: transform pada animasi dan hindari blur radius di atas 24px agar kartu clay tetap mulus di perangkat mobile.',
    createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    likes: 15,
    likedByUserIds: [],
  },
];

// Seed Announcements
const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Selamat Datang di Mentarimuda! Ruang Kolaborasi & Diskusi Pemuda',
    content: 'Forum resmi Mentarimuda dikelola oleh Administrator Naufal Muhammad Al Hikam. Nikmati fitur Polling, Q&A dengan solusi terverifikasi, dan dashboard analitik real-time!',
    type: 'success',
    active: true,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

// Seed Activity Events
const SEED_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    actionText: 'menerbitkan polling interaktif',
    userName: ADMIN_USER.displayName,
    userAvatar: ADMIN_USER.avatar,
    targetTitle: 'Stack Web Paling Menjanjikan 2026',
    targetSlug: 'polling-stack-web-dan-bahasa-paling-menjanjikan-2026',
    type: 'vote',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'act-2',
    actionText: 'memberikan solusi terverifikasi pada',
    userName: ADMIN_USER.displayName,
    userAvatar: ADMIN_USER.avatar,
    targetTitle: 'Menyusun CV ATS-friendly untuk Beasiswa LPDP',
    targetSlug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    type: 'solve',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'act-3',
    actionText: 'memulai diskusi baru',
    userName: ADMIN_USER.displayName,
    userAvatar: ADMIN_USER.avatar,
    targetTitle: 'Membangun Side-Income dari Produk Digital',
    targetSlug: 'membangun-side-income-dari-produk-digital-tanpa-burnout',
    type: 'post',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

// Seed Initial Notifications
const SEED_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    recipientId: ADMIN_USER.id,
    senderName: 'Tamu Mentari',
    senderAvatar: GUEST_USER.avatar,
    type: 'comment',
    title: 'Tanggapan Baru di Topik Anda',
    message: 'Tamu Mentari memberikan komentar apresiasi pada panduan CV ATS.',
    targetSlug: 'bagaimana-cara-menyusun-cv-ats-friendly-untuk-beasiswa-lpdp',
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    recipientId: ADMIN_USER.id,
    senderName: 'Sistem Mentarimuda',
    senderAvatar: ADMIN_USER.avatar,
    type: 'announcement',
    title: 'Dashboard Admin Siap Digunakan',
    message: 'Anda login sebagai Admin Utama (Naufal Muhammad Al Hikam) dengan hak akses penuh.',
    targetSlug: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
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
    // Default user is ALWAYS Guest (Tamu / No Login) by default
    const storedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!storedUserId || storedUserId === ADMIN_USER.id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, GUEST_USER.id);
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

  // USERS & AUTHENTICATION
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
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || GUEST_USER.id;
    const found = users.find(u => u.id === currentId);
    if (found) return found;
    return users.find(u => u.role === 'guest') || GUEST_USER;
  },

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    notifyStateChange('user_switched', userId);
  },

  logout(): void {
    this.setCurrentUser(GUEST_USER.id);
    notifyStateChange('user_switched', GUEST_USER.id);
  },

  // Login verification logic
  login(username: string, password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    // 1. Admin Login check
    if (cleanUsername === ADMIN_USER.username.toLowerCase()) {
      if (password === ADMIN_USER.password) {
        this.setCurrentUser(ADMIN_USER.id);
        return { success: true, user: ADMIN_USER };
      } else {
        return { success: false, error: 'Password Admin salah! Silakan masukkan password yang valid.' };
      }
    }

    // 2. Member Login check
    const member = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (member) {
      if (member.isBanned) {
        return { success: false, error: 'Akun ini telah dinonaktifkan oleh administrator.' };
      }
      if (member.password && member.password !== password) {
        return { success: false, error: 'Password salah untuk akun member ini.' };
      }
      this.setCurrentUser(member.id);
      return { success: true, user: member };
    }

    return { success: false, error: 'Username tidak ditemukan. Buat akun baru atau gunakan mode tamu.' };
  },

  // Switch to Guest mode
  setGuestMode(guestDisplayName?: string): User {
    const users = this.getUsers();
    let guestUser = users.find(u => u.role === 'guest');

    if (guestUser) {
      if (guestDisplayName && guestDisplayName.trim()) {
        guestUser.displayName = guestDisplayName.trim();
        guestUser.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(guestDisplayName)}&backgroundColor=e2e8f0`;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      this.setCurrentUser(guestUser.id);
      return guestUser;
    }

    guestUser = {
      ...GUEST_USER,
      displayName: guestDisplayName?.trim() || 'Tamu Mentari',
    };
    users.push(guestUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(guestUser.id);
    return guestUser;
  },

  // Register New Member
  createUser(userData: Partial<User> & { password?: string }): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username || `member_${Date.now().toString().slice(-4)}`,
      displayName: userData.displayName || 'Anggota Mentari',
      email: userData.email || `${userData.username}@mentari.id`,
      password: userData.password || '',
      role: 'member', // Default user registered is member
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
    if (!user || user.role === 'admin') return false; // Cannot ban admin

    user.isBanned = !user.isBanned;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyStateChange('user_banned_toggled', user);
    return !!user.isBanned;
  },

  changeUserRole(userId: string, newRole: UserRole): void {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user || user.id === ADMIN_USER.id) return; // Keep main admin protected

    user.role = newRole;
    if (newRole === 'moderator' && !user.badges.includes('Moderator')) {
      user.badges.push('Moderator');
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyStateChange('user_role_changed', user);
  },

  // CATEGORIES
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const rawCategories: Category[] = data ? JSON.parse(data) : SEED_CATEGORIES;
      const posts = this.getPosts();
      
      // Calculate real, accurate threadCount for each category based on actual posts
      return rawCategories.map(cat => ({
        ...cat,
        threadCount: posts.filter(p => p.categorySlug === cat.slug).length,
      }));
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

    // Increment user answer/comment count if not guest
    const users = this.getUsers();
    const author = users.find(u => u.id === commentData.authorId);
    if (author && author.role !== 'guest') {
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
    if (solutionAuthor && solutionAuthor.role !== 'guest') {
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
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, GUEST_USER.id);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    notifyStateChange('data_reset');
  },

  // SIMULATOR FOR REAL-TIME PUSH NOTIFICATION DEMO
  simulateRandomInteraction(): PushNotification {
    const posts = this.getPosts();
    const currentUser = this.getCurrentUser();

    const randomPost = posts[Math.floor(Math.random() * posts.length)] || posts[0];

    const interactionTypes: { type: PushNotification['type']; title: string; message: string; senderName: string }[] = [
      {
        type: 'comment',
        senderName: 'Tamu Mentari #204',
        title: 'Komentar Baru Diterima!',
        message: `Tamu Mentari #204 memberikan tanggapan menarik pada "${randomPost.title.slice(0, 35)}..."`,
      },
      {
        type: 'upvote',
        senderName: 'Anggota Komunitas',
        title: 'Apresiasi Topik Komunitas',
        message: `Seorang anggota baru saja memberikan upvote pada topik "${randomPost.title.slice(0, 30)}..."!`,
      },
      {
        type: 'poll_vote',
        senderName: 'Pemuda Pemilih',
        title: 'Suara Baru Masuk ke Polling',
        message: `Partisipan baru ikut memberikan suara pada topik hangat "${randomPost.title.slice(0, 30)}..."`,
      },
    ];

    const pick = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];

    const notif = this.createNotification({
      recipientId: currentUser.id,
      senderName: pick.senderName,
      senderAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(pick.senderName)}&backgroundColor=e2e8f0,b6e3f4`,
      type: pick.type,
      title: pick.title,
      message: pick.message,
      targetSlug: randomPost.slug,
    });

    this.logActivity(
      pick.type === 'comment' ? 'menambahkan komentar pada' : pick.type === 'poll_vote' ? 'memilih opsi polling pada' : 'menyukai postingan',
      pick.senderName,
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(pick.senderName)}&backgroundColor=e2e8f0,b6e3f4`,
      randomPost.title,
      randomPost.slug,
      pick.type === 'comment' ? 'comment' : pick.type === 'poll_vote' ? 'vote' : 'post'
    );

    return notif;
  },
};
