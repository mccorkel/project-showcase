import React, { useState, useEffect, useCallback } from 'react';
import { extendSession } from '../utils/security/sessionManager';

interface SessionTimeoutDialogProps {
  /**
   * Time in milliseconds before session expires to show the dialog
   * Default: 5 minutes (300000 ms)
   */
  warningTime?: number;
  
  /**
   * Time in milliseconds to check if session is about to expire
   * Default: 1 minute (60000 ms)
   */
  checkInterval?: number;
  
  /**
   * Callback function to execute when session expires
   */
  onSessionExpired: () => void;
  
  /**
   * Session timeout in milliseconds
   * This should match the timeout set in the session manager
   */
  sessionTimeout: number;
}

/**
 * Session Timeout Dialog Component
 * 
 * This component displays a dialog when the user's session is about to expire,
 * giving them the option to extend their session or log out.
 */
const SessionTimeoutDialog: React.FC<SessionTimeoutDialogProps> = ({
  warningTime = 5 * 60 * 1000, // 5 minutes
  checkInterval = 60 * 1000, // 1 minute
  onSessionExpired,
  sessionTimeout
}) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  // Format remaining time as MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Extend the session
  const handleExtendSession = useCallback(() => {
    const extended = extendSession();
    if (extended) {
      setShowDialog(false);
    }
  }, []);
  
  // Log out
  const handleLogout = useCallback(() => {
    onSessionExpired();
  }, [onSessionExpired]);
  
  // Check if session is about to expire
  useEffect(() => {
    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem('last_activity');
      if (!lastActivity) {
        return;
      }
      
      const lastActivityTime = parseInt(lastActivity);
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastActivityTime;
      const timeUntilExpiration = sessionTimeout - elapsedTime;
      
      if (timeUntilExpiration <= warningTime) {
        setShowDialog(true);
        setRemainingTime(timeUntilExpiration);
      } else {
        setShowDialog(false);
      }
    };
    
    // Check immediately
    checkSessionTimeout();
    
    // Set up interval to check periodically
    const intervalId = setInterval(checkSessionTimeout, checkInterval);
    
    // Set up countdown timer when dialog is shown
    let countdownId: number;
    if (showDialog) {
      countdownId = window.setInterval(() => {
        setRemainingTime(prevTime => {
          const newTime = prevTime - 1000;
          if (newTime <= 0) {
            handleLogout();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(intervalId);
      if (countdownId) {
        clearInterval(countdownId);
      }
    };
  }, [checkInterval, handleLogout, sessionTimeout, showDialog, warningTime]);
  
  // Don't render anything if dialog is not shown
  if (!showDialog) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-red-600">Session Timeout Warning</h2>
        <p className="mb-4">
          Your session will expire in <span className="font-bold">{formatTime(remainingTime)}</span> due to inactivity.
        </p>
        <p className="mb-6">
          Would you like to extend your session or log out?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Log Out
          </button>
          <button
            onClick={handleExtendSession}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutDialog; 