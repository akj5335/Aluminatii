# TODO: Implement USPs for Aluminati Platform

## Backend Models Updates
- [ ] Update backend/models/User.js: Add college field for college-centric ownership
- [ ] Update backend/models/Profile.js: Add verified (boolean), reputationScore (number), mentorshipHistory (array), credibilityActivities (array)
- [ ] Update backend/models/Connection.js: Add connectionType (enum: sameBatch, sameCompany, sameHometown, sharedEvent), reason (string)
- [ ] Create backend/models/Mentorship.js: New model with mentor, mentee, startDate, endDate, expectations (array), history (array)
- [ ] Update backend/models/Events.js: Add attendees (array of user IDs), interactions (array of messages/shares)
- [ ] Create backend/models/College.js: New model with name, identity, events (array), leaderboards (array)

## Backend Controllers Updates
- [ ] Update backend/routes/controllers/connectionController.js: Add logic for purpose-driven suggestions based on profiles
- [ ] Update backend/routes/controllers/eventController.js: Add attendee management and interaction features
- [ ] Create backend/routes/controllers/mentorshipController.js: Handle mentorship requests, windows, history
- [ ] Update backend/routes/controllers/profileController.js: Add verification approval, reputation updates

## Frontend Updates
- [ ] Update frontend/profile.html: Display verification badge, reputation score, mentorship history
- [ ] Update frontend/directory.html: Show purpose-driven connection suggestions
- [ ] Update frontend/events.html: Show attendees, allow pre/post event connections and shares
- [ ] Update frontend/mentorship.html: Display structured mentorship options
- [ ] Update frontend/style.css: Add styles for new USP elements (e.g., badges, leaderboards)

## Followup
- [ ] Test backend APIs for new features
- [ ] Update frontend scripts for dynamic content
- [ ] Ensure database migrations for new fields
