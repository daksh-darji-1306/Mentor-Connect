const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'MentorDashboard.jsx'), 'utf8');

// Replace Mock Data arrays with dynamic state and useEffect
content = content.replace(
  /\/\/ Mock Data\s*const stats = \[\s*\{ title: "Total Mentees", value: "12", icon: Users, trend: 15 \},\s*\{ title: "Hours Mentored", value: "245h", icon: Clock, trend: 8 \},\s*\{ title: "Avg. Rating", value: "4.9", icon: Star, trend: 0 \},\s*\];\s*const \[upcomingSessions, setUpcomingSessions\] = useState\(\[\]\);/,
  `const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [requestsList, setRequestsList] = useState([]);
    const [mentorStats, setMentorStats] = useState({ totalMentees: 0, hours: 0, rating: 4.9 });

    useEffect(() => {
        if (!user?.id) return;
        const fetchDashboardData = async () => {
            try {
                // Fetch pending requests
                const reqQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id), where('status', '==', 'pending'));
                const reqSnap = await getDocs(reqQ);
                const rList = [];
                for (const r of reqSnap.docs) {
                    const data = r.data();
                    const profileDoc = await getDoc(doc(db, 'profiles', data.mentee_id));
                    if (profileDoc.exists()) {
                        const p = profileDoc.data();
                        rList.push({
                           id: r.id,
                           name: p.full_name || p.email.split('@')[0],
                           role: p.profile_data?.currentRole || 'Mentee',
                           message: data.message || "Hi, I'd like to connect!"
                        });
                    }
                }
                setRequestsList(rList);

                // Fetch stats (accepted requests + sessions)
                const accQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id), where('status', '==', 'accepted'));
                const accSnap = await getDocs(accQ);
                
                const sessionQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id));
                const sessionSnap = await getDocs(sessionQ);
                
                let hours = 0;
                let menteesCount = accSnap.docs.length;
                
                sessionSnap.docs.forEach(d => {
                    const s = d.data();
                    if (s.booked_by) {
                        hours += (s.duration_minutes || 60) / 60;
                        menteesCount++; // simplistic mentees count
                    }
                });
                
                setMentorStats({ totalMentees: menteesCount, hours: Math.round(hours), rating: 4.9 });
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboardData();
    }, [user?.id]);

    const stats = [
        { title: "Total Mentees", value: mentorStats.totalMentees.toString(), icon: Users, trend: 15 },
        { title: "Hours Mentored", value: mentorStats.hours.toString() + "h", icon: Clock, trend: 8 },
        { title: "Avg. Rating", value: mentorStats.rating.toString(), icon: Star, trend: 0 },
    ];`
);

// Remove the `const requests = [...]`
content = content.replace(
  /const requests = \[\s*\{ name: "Jordan Lee"[\s\S]*?\];/,
  ``
);

// Update `requests.map` to `requestsList.map`
content = content.replace(
  /requests\.map\(\(req, i\) => \(/,
  `requestsList.map((req, i) => (`
);

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'MentorDashboard.jsx'), content);
console.log("Updated MentorDashboard");
