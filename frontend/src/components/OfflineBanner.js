import React from 'react';


const OfflineBanner = (props) => (
    props.offline && 
    <div className="offline-banner">
        You're working offline. You can still do your workouts but additional functionality is limited
    </div>
    )

export default OfflineBanner;