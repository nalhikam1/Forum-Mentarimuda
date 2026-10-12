export type PostType = 'diskusi' | 'pertanyaan' | 'polling';

export type UserRole = 'admin' | 'moderator' | 'member' | 'guest';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  interests?: string[];
  badges: string[];
  postCount: number;
  answerCount: number;
  solutionsCount: number;
  karma: number; // Poin reputasi Mentari
  joinedDate: string;
  isBanned?: boolean;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // e.g. 'amber', 'emerald', 'sky', 'indigo', 'rose', 'purple'
  iconName: string;
  threadCount: number;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  voterIds: string[];
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  allowMultiple?: boolean;
  expiresAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string | null; // For nested replies
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  authorBadges?: string[];
  content: string;
  createdAt: string;
  likes: number;
  likedByUserIds: string[];
  isAcceptedSolution?: boolean;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: PostType;
  categorySlug: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  likedByUserIds: string[];
  commentCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  isSolved?: boolean; // For 'pertanyaan'
  acceptedCommentId?: string;
  pollData?: PollData; // For 'polling'
  bookmarkedByUserIds?: string[];
}

export type NotificationType = 'comment' | 'upvote' | 'best_answer' | 'poll_vote' | 'announcement' | 'system';

export interface PushNotification {
  id: string;
  recipientId: string; // user id or 'all'
  senderName: string;
  senderAvatar: string;
  type: NotificationType;
  title: string;
  message: string;
  targetSlug: string;
  createdAt: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  actionText: string;
  userName: string;
  userAvatar: string;
  targetTitle: string;
  targetSlug: string;
  type: 'post' | 'comment' | 'vote' | 'solve' | 'moderation';
  timestamp: string;
}

export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalVotes: number;
  activeMembers: number;
  solvedRate: number; // percentage
  weeklyActivity: {
    day: string;
    posts: number;
    comments: number;
    votes: number;
  }[];
}
