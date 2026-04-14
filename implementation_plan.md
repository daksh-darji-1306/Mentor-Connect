# Role-Based Onboarding & Critical Fix

The onboarding process was originally hardcoded with the perspective of a student/mentee, asking questions like "monthly budget" and "learning goals". Additionally, there was a minor logic bug stopping the final "Complete" button from tracking the correct User ID in the backend, leaving you stuck.

## Proposed Changes

### [MODIFY] [Onboarding.jsx](file:///d:/Mentor-Connect/src/pages/Onboarding.jsx)
1. **Critical Bug Fix**
   - Change `user.uid` to `user.id` so that the `Supabase` database updates the row properly and routes you directly into the dashboard upon completion!

2. **Role-Tailored Flow**
   - Check the `user.role` from the Authentication Context to figure out what to show you during Onboarding.
   - **Mentees** will still see the native questions: "Learning Goals", "Career Path", and "Monthly Budget".
   - **Mentors** will get new curated fields: 
     - **Step 3 (Mentoring Areas):** Instead of "Learning Goals", we'll ask for "Specializations" and "Mentoring Style".
     - **Step 4 (Availability):** Instead of "Budget", we'll ask questions like "Years of Experience" and "Mentoring Capacity (Hours/Week)". 

## User Review Required

Does the proposed split in logic sound good? We can completely remove "Monthly Budget" for the Mentor sign-up process, and asking them for their specialized mentoring style makes the platform feel much more solid!
