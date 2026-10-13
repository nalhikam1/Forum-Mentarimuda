import React, { useState, useEffect } from 'react';
import { PollData } from '../types/forum';
import { storageService, subscribeToStateChange } from '../services/storage';
import { Vote, CheckCircle2, Award } from 'lucide-react';

interface PollWidgetProps {
  postId: string;
  pollData: PollData;
  onVoted?: () => void;
  compact?: boolean;
}

export const PollWidget: React.FC<PollWidgetProps> = ({
  postId,
  pollData,
  onVoted,
  compact = false,
}) => {
  const currentUser = storageService.getCurrentUser();
  const [currentPoll, setCurrentPoll] = useState<PollData>(pollData);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with prop
  useEffect(() => {
    setCurrentPoll(pollData);
  }, [pollData]);

  // Real-time listener across tabs and components
  useEffect(() => {
    const unsub = subscribeToStateChange((event) => {
      const { eventType, payload } = event.detail || {};
      if (eventType === 'poll_voted' && payload?.postId === postId) {
        const posts = storageService.getPosts();
        const found = posts.find(p => p.id === postId);
        if (found?.pollData) {
          setCurrentPoll(found.pollData);
        }
      }
    });
    return () => unsub();
  }, [postId]);

  // Check if current user has already voted
  const userVotedOption = currentPoll.options.find(opt => 
    opt.voterIds.includes(currentUser.id)
  );
  const hasVoted = !!userVotedOption;

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedOptionId || isSubmitting) return;

    setIsSubmitting(true);

    // 1. Instant optimistic update
    const updatedOptions = currentPoll.options.map(opt => {
      if (opt.id === selectedOptionId) {
        return {
          ...opt,
          voteCount: opt.voteCount + 1,
          voterIds: [...opt.voterIds, currentUser.id],
        };
      }
      return opt;
    });

    setCurrentPoll({
      ...currentPoll,
      totalVotes: currentPoll.totalVotes + 1,
      options: updatedOptions,
    });

    // 2. Persist to storage & trigger global real-time event
    const success = storageService.votePoll(postId, selectedOptionId, currentUser.id);
    setIsSubmitting(false);

    if (success && onVoted) {
      onVoted();
    }
  };

  const totalVotes = Math.max(1, currentPoll.totalVotes);

  return (
    <div 
      className={`clay-card-flat p-4.5 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 border-2 border-amber-200/60 rounded-2xl ${
        compact ? 'my-2' : 'my-4'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center clay-inset">
            <Vote className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            Polling Komunitas
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          {currentPoll.totalVotes} Total Suara
        </span>
      </div>

      <h4 className="font-bold text-slate-900 text-sm md:text-base mb-3 leading-snug">
        {currentPoll.question}
      </h4>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentPoll.options.map((option) => {
          const percentage = currentPoll.totalVotes > 0 
            ? Math.round((option.voteCount / currentPoll.totalVotes) * 100) 
            : 0;
          const isSelected = selectedOptionId === option.id;
          const isUserChoice = userVotedOption?.id === option.id;

          return (
            <div
              key={option.id}
              onClick={() => {
                if (!hasVoted) {
                  setSelectedOptionId(option.id);
                }
              }}
              className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                !hasVoted ? 'cursor-pointer hover:border-amber-400' : ''
              } ${
                isUserChoice
                  ? 'border-amber-500 bg-amber-50/50'
                  : isSelected
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-slate-100 bg-white'
              }`}
            >
              {/* Progress fill bar */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-200/70 to-orange-200/50 transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative p-3 flex items-center justify-between gap-3 text-xs md:text-sm font-medium z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  {!hasVoted && (
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  )}

                  {isUserChoice && (
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  )}

                  <span className={`text-slate-800 ${isUserChoice ? 'font-bold' : ''}`}>
                    {option.text}
                  </span>
                </div>

                {hasVoted && (
                  <div className="flex items-center gap-2 shrink-0 tabular-nums">
                    <span className="text-xs text-slate-500 font-normal">
                      {option.voteCount} suara
                    </span>
                    <span className="font-bold text-slate-900 text-xs md:text-sm">
                      {percentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {!hasVoted ? (
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400">
            Pilih salah satu opsi lalu klik Beri Suara
          </p>
          <button
            onClick={handleVote}
            disabled={!selectedOptionId || isSubmitting}
            className={`clay-btn-primary px-4 py-2 text-xs font-bold ${
              !selectedOptionId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Menyimpan...' : 'Beri Suara Sekarang'}
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Suara Anda telah tercatat secara real-time! Terima kasih atas partisipasinya.</span>
        </div>
      )}
    </div>
  );
};
