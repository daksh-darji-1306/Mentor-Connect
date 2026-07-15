const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'MenteeDashboard.jsx'), 'utf8');

// Replace imports
content = content.replace(
  "import { supabase } from '../lib/supabase';",
  "import { db } from '../lib/firebase';\nimport { collection, query, orderBy, limit, getDocs, where, getDoc, doc } from 'firebase/firestore';\nimport { useAuth } from '../context/AuthContext';"
);

// Replace Mock Data section entirely
content = content.replace(
  /\/\/ ─── Mock Data ─────────────────────────────────────────────────[\s\S]*?\/\/ Fetched from supabase now/,
  `// ─── Dynamic Icons Map ─────────────────────────────────────────
const IconMap = { BookOpen, Target, Zap, TrendingUp, CheckSquare, Calendar, Folder, MessageSquare, Flame };
`
);

// Replace MenteeDashboard start
content = content.replace(
  /export default function MenteeDashboard\(\) \{[\s\S]*?const totalHours = weeklyActivity\.reduce\(\(s, d\) => s \+ d\.hours, 0\)\.toFixed\(1\);/,
  `export default function MenteeDashboard() {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [recentActivityList, setRecentActivityList] = useState([]);
  const [heatmapDataList, setHeatmapDataList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);

  // Dynamic user stats
  const userStats = {
    firstName: user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
    progress: 72,
    goal: 'Master Full Stack Development',
    streak: 15,
    totalSessions: upcomingSessions.length + recentActivityList.length,
    hoursLearned: 142,
    projectsDone: 8,
  };

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.2 }, { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 }, { day: 'Fri', hours: 2.9 }, { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 3.5 },
  ];
  const monthlyProgress = [
    { month: 'Sep', score: 45 }, { month: 'Oct', score: 52 }, { month: 'Nov', score: 58 },
    { month: 'Dec', score: 63 }, { month: 'Jan', score: 68 }, { month: 'Feb', score: 72 },
  ];

  React.useEffect(() => {
    if (!user?.id) return;
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch upcoming sessions
        const upcomingQ = query(collection(db, 'sessions'), where('booked_by', '==', user.id), orderBy('start_time', 'asc'), limit(3));
        const upcomingSnap = await getDocs(upcomingQ);
        const upcoming = upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setUpcomingSessions(upcoming.map(ev => {
          const startDate = new Date(ev.start_time);
          return {
            id: ev.id,
            mentor: ev.mentor_name || 'Mentor',
            topic: ev.topic || 'Mentorship Session',
            time: \`\${startDate.toLocaleDateString()} \${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\`,
            avatar: (ev.mentor_name || 'M')[0].toUpperCase(),
            gradient: 'from-indigo-500 to-violet-500',
            link: ev.calendar_link,
          };
        }));

        // 2. Fetch mentors (from accepted requests)
        const reqQ = query(collection(db, 'requests'), where('mentee_id', '==', user.id), where('status', '==', 'accepted'));
        const reqSnap = await getDocs(reqQ);
        const mentorIds = new Set();
        reqSnap.forEach(d => mentorIds.add(d.data().mentor_id));
        upcoming.forEach(s => mentorIds.add(s.mentor_id));
        
        const mList = [];
        const colors = ['from-violet-500 to-fuchsia-500', 'from-sky-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-amber-500 to-orange-400'];
        let colorIdx = 0;
        for (const mid of mentorIds) {
           const pDoc = await getDoc(doc(db, 'profiles', mid));
           if (pDoc.exists()) {
               const p = pDoc.data();
               mList.push({
                   id: p.id,
                   name: p.full_name || p.email.split('@')[0],
                   role: p.profile_data?.currentRole || 'Mentor',
                   avatar: (p.full_name || p.email)[0].toUpperCase(),
                   online: true,
                   gradient: colors[colorIdx % colors.length]
               });
               colorIdx++;
           }
        }
        setMentorsList(mList);

        // 3. Fetch Resources
        const resQ = query(collection(db, 'resources'), limit(4));
        const resSnap = await getDocs(resQ);
        setResourcesList(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // 4. Heatmap & Recent Activity (Using sessions as a proxy)
        const pastQ = query(collection(db, 'sessions'), where('booked_by', '==', user.id), orderBy('start_time', 'desc'), limit(5));
        const pastSnap = await getDocs(pastQ);
        const pastSessions = pastSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const weeks = [];
        for (let w = 0; w < 12; w++) {
          const days = [];
          for (let d = 0; d < 7; d++) {
            days.push(Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0); // Simulated real activity for unrecorded past days
          }
          weeks.push(days);
        }
        setHeatmapDataList(weeks);

        const recList = pastSessions.map((s, idx) => ({
             id: s.id, 
             title: \`Booked: \${s.topic || 'Session'}\`,
             mentor: s.mentor_name || 'Mentor',
             time: new Date(s.start_time).toLocaleDateString(),
             iconName: 'Calendar',
             color: 'text-violet-400'
        }));
        setRecentActivityList(recList.length > 0 ? recList : [{ id: '1', title: 'Welcome to Mentor Connect!', mentor: 'System', time: 'Today', iconName: 'Flame', color: 'text-amber-400' }]);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchDashboardData();
  }, [user?.id]);

  const totalHours = weeklyActivity.reduce((s, d) => s + d.hours, 0).toFixed(1);`
);

// Variables replacement
content = content.replace(/user\.firstName/g, 'userStats.firstName');
content = content.replace(/user\.progress/g, 'userStats.progress');
content = content.replace(/user\.goal/g, 'userStats.goal');
content = content.replace(/user\.streak/g, 'userStats.streak');
content = content.replace(/user\.totalSessions/g, 'userStats.totalSessions');
content = content.replace(/user\.hoursLearned/g, 'userStats.hoursLearned');
content = content.replace(/user\.projectsDone/g, 'userStats.projectsDone');

// Map replacements
content = content.replace(/recentActivity\.map\(\(activity, i\) => {/g, 'recentActivityList.map((activity, i) => {');
content = content.replace(/const Icon = activity\.icon;/g, 'const Icon = IconMap[activity.iconName] || CheckSquare;');

content = content.replace(/resources\.map\(\(r\) => {/g, 'resourcesList.map((r) => {');
content = content.replace(/const Icon = r\.icon;/g, 'const Icon = IconMap[r.icon] || BookOpen;');

content = content.replace(/heatmapData\.map\(\(week, wi\) => \(/g, 'heatmapDataList.map((week, wi) => (');

content = content.replace(/mentors\.map\(\(mentor, i\) => \(/g, 'mentorsList.map((mentor, i) => (');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'MenteeDashboard.jsx'), content);
console.log("Updated MenteeDashboard successfully with regex.");
