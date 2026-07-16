import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const NIM_API_KEY = import.meta.env.VITE_NVIDIA_NIM_API_KEY;
// Using the Vite proxy to bypass CORS
const NIM_API_URL = '/nim-api/v1/chat/completions';
const MODEL_NAME = 'meta/llama-3.1-8b-instruct';

export async function fetchMentorsForContext() {
    try {
        const q = query(collection(db, 'profiles'), where('role', '==', 'mentor'));
        const querySnapshot = await getDocs(q);
        const mentors = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            mentors.push({
                id: doc.id,
                name: data.full_name,
                headline: data.profile_data?.headline || '',
                company: data.profile_data?.company || '',
                skills: data.profile_data?.skills || [],
                bio: data.profile_data?.bio || '',
            });
        });
        return mentors;
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return [];
    }
}

export async function generateAIChatResponse(messages, activeMentors) {
    if (!NIM_API_KEY) {
        throw new Error("NVIDIA NIM API key is missing. Please add VITE_NVIDIA_NIM_API_KEY to your .env file.");
    }

    const mentorsContext = activeMentors.map(m => 
        `- Name: ${m.name}, ID: ${m.id}, Role: ${m.headline} at ${m.company}, Skills: ${m.skills.join(', ')}, Bio: ${m.bio}`
    ).join('\n');

    const systemPrompt = `You are a strict, professional Career Counselor and Mentor Matchmaker for the Mentor Connect platform.
Your ONLY purposes are to:
1. Provide actionable career guidance and advice.
2. Recommend specific mentors from the provided list based on the user's needs.

If the user asks about ANYTHING unrelated to career guidance, mentorship, or the platform, you must politely but firmly refuse to answer. Do not write code, do not give recipes, do not chat casually.

Here is the current list of active mentors on the platform:
${mentorsContext}

When recommending a mentor, ALWAYS mention their name, headline, and why they are a good match based on their skills.
CRITICAL INSTRUCTION: When you recommend a specific mentor, you MUST append exactly this string at the end of your sentence: [MENTOR_ID: <their_id>] where <their_id> is the ID provided in the list above. Do NOT wrap it in backticks.`;

    const fullMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
    ];

    const response = await fetch(NIM_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NIM_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: fullMessages,
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
