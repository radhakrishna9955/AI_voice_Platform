'use server';

import { db, storage } from '@/firebase/admin';
import { getCurrentUser } from './auth.actions';

export async function updateUserProfile(userId: string, data: {
  name: string;
  phone?: string;
  bio?: string;
  linkedIn?: string;
  github?: string;
}) {
  try {
    await db.collection('users').doc(userId).update({
      ...data,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
}

export async function uploadResume(userId: string, file: File) {
  try {
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get Firebase Storage bucket
    const bucket = storage.bucket();
    const fileName = `resumes/${userId}/${Date.now()}-${file.name}`;
    const fileUpload = bucket.file(fileName);

    // Upload file
    await fileUpload.save(buffer, {
      metadata: {
        contentType: 'application/pdf',
      },
    });

    // Make file publicly accessible
    await fileUpload.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Update user document with resume URL
    await db.collection('users').doc(userId).update({
      resumeUrl: publicUrl,
      resumeUpdatedAt: new Date().toISOString()
    });

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading resume:', error);
    return { success: false, message: 'Failed to upload resume' };
  }
}

export async function deleteResume(userId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.id !== userId) {
      return { success: false, message: 'Unauthorized' };
    }

    // Delete from storage
    if (user.resumeUrl) {
      const bucket = storage.bucket();
      const fileName = user.resumeUrl.split(`${bucket.name}/`)[1];
      await bucket.file(fileName).delete();
    }

    // Update user document
    await db.collection('users').doc(userId).update({
      resumeUrl: null,
      resumeUpdatedAt: null
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, message: 'Failed to delete resume' };
  }
}
