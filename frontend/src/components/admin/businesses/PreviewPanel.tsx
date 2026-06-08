'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetchJson } from '@/lib/adminApi';
import { resolveMediaUrl } from '@/lib/api';

interface Business {
  id: number;
  name: string;
  owner: string;
  category: string;
  city: string;
  submittedDate: string;
  status: string;
  images: string[];
  description?: string;
}

interface PreviewPanelProps {
  business: Business;
  onClose: () => void;
}

export default function PreviewPanel({ business, onClose }: PreviewPanelProps) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const moderateMutation = useMutation({
    mutationFn: async ({
      id,
      action,
      reason,
    }: {
      id: number;
      action: 'approve' | 'reject';
      reason?: string;
    }) => {
      return adminFetchJson(`/businesses/${id}/moderate`, {
        method: 'PUT',
        body: JSON.stringify({
          status: action === 'approve' ? 'approved' : 'rejected',
          reason,
          notes,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      onClose();
    },
  });

  const imgSrc = resolveMediaUrl(business.images?.[0]);

  return (
    <div
      className="fixed top-0 right-0 h-screen w-1/2 shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-50 border-l border-surface-variant/30 flex flex-col overflow-hidden"
      style={{ background: 'rgba(249, 249, 247, 0.8)', backdropFilter: 'blur(24px)' }}
    >
      <div className="px-8 py-6 border-b border-surface-variant/20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 className="text-xl font-headline font-bold">Review Submission</h3>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-error text-on-error font-bold text-sm shadow-md shadow-error/20"
            onClick={() => setShowRejectModal(true)}
          >
            <span className="material-symbols-outlined text-sm">block</span>
            Reject
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-on-secondary font-bold text-sm shadow-md shadow-secondary/20"
            onClick={() => moderateMutation.mutate({ id: business.id, action: 'approve' })}
            disabled={moderateMutation.isPending}
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            {moderateMutation.isPending ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
            Tourist Preview
          </h4>
          <div className="w-full max-w-sm mx-auto bg-surface-container-lowest rounded-lg shadow-xl overflow-hidden ring-1 ring-black/5 transform rotate-1">
            <div className="h-56 relative overflow-hidden">
              {imgSrc && <img className="w-full h-full object-cover" src={imgSrc} />}
              <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                {business.status === 'pending' ? 'New Spot' : business.status}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-2xl font-headline font-extrabold text-[#1A1C1B]">
                  {business.name}
                </h5>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>{business.city}</span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                {business.description || 'No description provided.'}
              </p>
              <button className="w-full py-3 rounded-full bg-[#1A1C1B] text-white font-bold text-sm tracking-wide">
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
            Admin Internal Notes
          </h4>
          <textarea
            className="w-full h-32 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg p-4 text-sm transition-all"
            placeholder="Add private notes for the moderation team..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
            Status History
          </h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-on-primary-fixed">
                    edit
                  </span>
                </div>
                <div className="w-px h-full bg-surface-container-high mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold">{business.name}</p>
                <p className="text-xs text-on-surface-variant">
                  Submitted by {business.owner} • {business.submittedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A1C1B]/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Reject Listing</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Provide a reason for rejecting <strong>{business.name}</strong>.
            </p>
            <textarea
              className="w-full h-28 bg-surface-container-low border rounded-lg p-4 text-sm mb-6"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <button
                className="px-6 py-2.5 rounded-full border border-outline-variant font-bold text-sm hover:bg-surface-container-low transition-colors"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 rounded-full bg-error text-on-error font-bold text-sm shadow-lg"
                onClick={() => {
                  moderateMutation.mutate({
                    id: business.id,
                    action: 'reject',
                    reason: rejectReason,
                  });
                  setShowRejectModal(false);
                }}
                disabled={moderateMutation.isPending}
              >
                {moderateMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
