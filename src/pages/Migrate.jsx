import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const Migrate = () => {
    const [status, setStatus] = useState('Idle');
    const [logs, setLogs] = useState([]);

    const log = (msg) => setLogs(prev => [...prev, msg]);

    const runMigration = async () => {
        setStatus('Migrating...');
        try {
            // 1. Activity Logs
            const activitySnap = await getDocs(collection(db, 'activity_logs'));
            for (const d of activitySnap.docs) {
                try {
                    const data = d.data();
                    if (data.user_id) {
                        await setDoc(doc(db, 'profiles', data.user_id, 'activity_logs', d.id), data);
                    }
                    await deleteDoc(d.ref);
                    log(`Processed activity_log ${d.id}`);
                } catch (err) {
                    log(`Error on activity_log ${d.id}: ${err.message}`);
                }
            }

            // 2. Resources
            const resourceSnap = await getDocs(collection(db, 'resources'));
            for (const d of resourceSnap.docs) {
                try {
                    const data = d.data();
                    if (data.mentor_id) {
                        await setDoc(doc(db, 'profiles', data.mentor_id, 'resources', d.id), data);
                    }
                    await deleteDoc(d.ref);
                    log(`Processed resource ${d.id}`);
                } catch (err) {
                    log(`Error on resource ${d.id}: ${err.message}`);
                }
            }

            // 3. Sessions
            const sessionSnap = await getDocs(collection(db, 'sessions'));
            for (const d of sessionSnap.docs) {
                try {
                    const data = d.data();
                    if (data.mentor_id && data.mentee_id) {
                        await setDoc(doc(db, 'profiles', data.mentor_id, 'sessions', d.id), data);
                        await setDoc(doc(db, 'profiles', data.mentee_id, 'sessions', d.id), data);
                    }
                    await deleteDoc(d.ref);
                    log(`Processed session ${d.id}`);
                } catch (err) {
                    log(`Error on session ${d.id}: ${err.message}`);
                }
            }

            // 4. Requests
            const requestSnap = await getDocs(collection(db, 'requests'));
            for (const d of requestSnap.docs) {
                try {
                    const data = d.data();
                    if (data.mentor_id && data.mentee_id) {
                        await setDoc(doc(db, 'profiles', data.mentor_id, 'requests', d.id), data);
                    }
                    await deleteDoc(d.ref);
                    log(`Processed request ${d.id}`);
                } catch (err) {
                    log(`Error on request ${d.id}: ${err.message}`);
                }
            }

            // 5. Chats (using collectionGroup because chat docs might be virtual)
            const { collectionGroup } = await import('firebase/firestore');
            const msgGroupSnap = await getDocs(collectionGroup(db, 'messages'));
            for (const m of msgGroupSnap.docs) {
                try {
                    // Only migrate if it's in the root 'chats' collection
                    if (m.ref.path.startsWith('chats/')) {
                        const mData = m.data();
                        const chatId = m.ref.parent.parent.id; // chats/{chatId}/messages/{msgId} -> parent is messages, parent.parent is chats/{chatId}
                        
                        if (mData.sender_id && mData.receiver_id) {
                            await setDoc(doc(db, 'profiles', mData.sender_id, 'chats', chatId, 'messages', m.id), mData);
                            await setDoc(doc(db, 'profiles', mData.receiver_id, 'chats', chatId, 'messages', m.id), mData);
                        }
                        await deleteDoc(m.ref);
                        log(`Processed chat message ${m.id}`);
                    }
                } catch (err) {
                    log(`Error on message ${m.id}: ${err.message}`);
                }
            }

            setStatus('Done!');
        } catch (e) {
            console.error(e);
            setStatus('Error: ' + e.message);
        }
    };

    return (
        <div className="p-8 mt-24 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Database Migration</h1>
            <button onClick={runMigration} className="bg-primary text-primary-foreground px-4 py-2 rounded">
                Run Migration
            </button>
            <p className="mt-4 font-semibold text-lg text-foreground">Status: {status}</p>
            <div className="mt-4 h-64 overflow-y-auto bg-card border border-border p-4 rounded-xl text-sm font-mono text-muted-foreground">
                {logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
        </div>
    );
};

export default Migrate;
