import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logActivity = async (userId, actionType, details = {}) => {
    if (!userId) return;
    
    try {
        await addDoc(collection(db, 'profiles', userId, 'activity_logs'), {
            user_id: userId,
            action_type: actionType,
            timestamp: serverTimestamp(),
            ...details
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
