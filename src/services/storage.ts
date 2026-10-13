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
  postCount: 0,
  answerCount: 0,
  solutionsCount: 0,
  karma: 0,
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
  karma: 0,
  joinedDate: new Date().toISOString(),
};

// Only Admin and Guest exist by default
const SEED_USERS: User[] = [ADMIN_USER, GUEST_USER];

// Seed Posts — 100% clean and zeroed out for production
const SEED_POSTS: Post[] = [];

// Seed Comments — 100% clean and zeroed out
const SEED_COMMENTS: Comment[] = [];

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

// Seed Activity Events — 100% clean and zeroed out
const SEED_ACTIVITIES: ActivityEvent[] = [];

// Seed Initial Notifications — 100% clean
const SEED_NOTIFICATIONS: PushNotification[] = [];

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

    // Automatic purge of all old demo browser storage to enforce 0-data baseline
    const CLEAN_STORAGE_KEY = 'mentarimuda_zero_data_v1';
    if (!localStorage.getItem(CLEAN_STORAGE_KEY)) {
      [
        'mentarimuda_posts', 'mentarimuda_posts_v4', 'mentarimuda_posts_v5',
        'mentarimuda_categories', 'mentarimuda_categories_v4', 'mentarimuda_categories_v5',
        'mentarimuda_comments', 'mentarimuda_comments_v4', 'mentarimuda_comments_v5',
        'mentarimuda_activities', 'mentarimuda_activities_v4', 'mentarimuda_activities_v5',
        'mentarimuda_notifications', 'mentarimuda_notifications_v4', 'mentarimuda_notifications_v5',
        'mentarimuda_users', 'mentarimuda_users_v4', 'mentarimuda_users_v5',
      ].forEach((key) => {
        try { localStorage.removeItem(key); } catch {}
      });

      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(SEED_COMMENTS));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, GUEST_USER.id);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
      localStorage.setItem(CLEAN_STORAGE_KEY, 'true');
      return;
    }

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
      karma: 0,
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

      // Real-time activity log
      this.logActivity(
        'menyukai topik',
        currentUser.displayName,
        currentUser.avatar,
        post.title,
        post.slug,
        'vote'
      );

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

    // Update author's karma in real-time (+5 on like, -5 on unlike)
    const users = this.getUsers();
    const author = users.find(u => u.id === post.authorId);
    if (author && author.role !== 'guest') {
      author.karma = Math.max(0, (author.karma || 0) + (hasLiked ? -5 : 5));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    notifyStateChange('post_liked', { postId, likes: post.likes, hasLiked: !hasLiked, post });
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
    const currentUser = this.getCurrentUser();

    if (hasLiked) {
      comment.likedByUserIds = comment.likedByUserIds.filter(id => id !== userId);
      comment.likes = Math.max(0, (comment.likes || 1) - 1);
    } else {
      comment.likedByUserIds.push(userId);
      comment.likes = (comment.likes || 0) + 1;

      // Find post for notification & activity
      const posts = this.getPosts();
      const post = posts.find(p => p.id === comment.postId);

      this.logActivity(
        'menyukai komentar pada',
        currentUser.displayName,
        currentUser.avatar,
        post?.title || 'Diskusi',
        post?.slug || '',
        'vote'
      );

      if (comment.authorId !== userId) {
        this.createNotification({
          recipientId: comment.authorId,
          senderName: currentUser.displayName,
          senderAvatar: currentUser.avatar,
          type: 'upvote',
          title: 'Komentar Anda Disukai',
          message: `${currentUser.displayName} menyukai komentar Anda pada "${(post?.title || 'Diskusi').slice(0, 35)}..."`,
          targetSlug: post?.slug || '',
        });
      }
    }

    // Update comment author's karma in real-time
    const users = this.getUsers();
    const author = users.find(u => u.id === comment.authorId);
    if (author && author.role !== 'guest') {
      author.karma = Math.max(0, (author.karma || 0) + (hasLiked ? -5 : 5));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    notifyStateChange('comment_liked', { commentId, likes: comment.likes, hasLiked: !hasLiked, comment });
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
    const activities = this.getActivityEvents();

    let totalVotes = 0;
    posts.forEach(p => {
      if (p.pollData) totalVotes += p.pollData.totalVotes;
    });

    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0) +
                       comments.reduce((sum, c) => sum + (c.likes || 0), 0);

    const questions = posts.filter(p => p.type === 'pertanyaan');
    const solvedQuestions = questions.filter(p => p.isSolved);
    const solvedRate = questions.length > 0 ? Math.round((solvedQuestions.length / questions.length) * 100) : 0;

    // Real weekly activity calculated from actual item dates
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const now = new Date();
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400000;
      const dayName = dayNames[d.getDay()];

      const dayPosts = posts.filter(p => {
        const t = new Date(p.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayComments = comments.filter(c => {
        const t = new Date(c.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayVotes = activities.filter(a => {
        const t = new Date(a.timestamp).getTime();
        return a.type === 'vote' && t >= dayStart && t < dayEnd;
      }).length;

      weeklyActivity.push({
        day: dayName,
        posts: dayPosts,
        comments: dayComments,
        votes: dayVotes,
      });
    }

    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      totalVotes,
      totalLikes,
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
};
