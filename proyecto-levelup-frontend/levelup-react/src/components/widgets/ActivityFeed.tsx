import React from 'react';

interface ActivityItem {
  icon: string;
  description: string;
  time: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="activity-list">
      {activities.map((activity, index) => (
        <div key={index} className="activity-item">
          <i className={activity.icon}></i>
          <span>{activity.description}</span>
          <small>{activity.time}</small>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
