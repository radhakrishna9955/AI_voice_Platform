"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateUserProfile, uploadResume } from '@/lib/actions/profile.actions';

interface ProfileFormProps {
  user: User;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    bio: user.bio || '',
    linkedIn: user.linkedIn || '',
    github: user.github || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateUserProfile(user.id, formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadResume(user.id, file);
      if (result.success) {
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error(result.message || 'Failed to upload resume');
      }
    } catch (error) {
      toast.error('An error occurred while uploading');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            className="w-full min-h-24 bg-dark-200 px-5 py-3 border border-input"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
          <Input
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <Input
            value={formData.github}
            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold mb-4">Resume (Optional)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your resume to share with the AI interviewer during practice sessions. Maximum size: 5MB (PDF only)
          </p>
          
          {user.resumeUrl && (
            <div className="mb-4 p-4 bg-dark-300 rounded-lg">
              <p className="text-sm mb-2">Current Resume:</p>
              <a 
                href={user.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-200 hover:underline"
              >
                View Resume
              </a>
            </div>
          )}

          <Input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            disabled={uploading}
            className="cursor-pointer"
          />
          {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
        </div>

        <Button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
