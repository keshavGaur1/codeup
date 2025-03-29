import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import { RoomProvider } from "./liveblocks.config.js";
import { INITIAL_STORAGE } from "./liveblocks.config.js";
import Login from "./pages/Login.jsx";
import TeacherEvaluation from "./pages/TeacherEvaluation.jsx";
import Register from "./pages/Register.jsx";
import Workspaces from "./pages/Workspaces.jsx";
import Workspace from "./pages/Workspace.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Header from "./components/Header.jsx";
import DostAIPage from "./pages/DostAi.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import TestWorkspace from "./pages/TestWorkspace.jsx"; // New component for test workspace
import CreateTest from "./components/CreateTest.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LoadingSpinner from "./common/LoadingSpinner.jsx";

const App = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [isLiveSharing, setIsLiveSharing] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (!isLiveSharing) {
      return () => {
        client.disconnect();
      };
    }
  }, [isLiveSharing]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const toggleLiveSharing = () => {
    if (isLiveSharing) {
      client.disconnect();
    }
    setIsLiveSharing((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <RoomProvider
        id={`app-${user?.uid || "anonymous"}`}
        initialPresence={{ cursor: null }}
        initialStorage={INITIAL_STORAGE}
        userInfo={{
          name: user?.user?.displayName || "Anonymous",
        }}
      >
        <div className="min-h-screen bg-background">
          <Header isLiveSharing={isLiveSharing} toggleLiveSharing={toggleLiveSharing} />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={user ? <Navigate to="/dashboard" /> : <Register />} 
              />
              <Route 
                path="/workspaces" 
                element={
                  user ? <Workspaces /> : <Navigate to="/login" />
                } 
              />
              <Route path="/teacher/evaluate/:submissionId" element={<TeacherEvaluation />} />
              <Route 
                path="/dashboard" 
                element={
                  user ? (
                    user.role === "student" ? (
                      <StudentDashboard />
                    ) : (
                      <TeacherDashboard />
                    )
                  ) : (
                    <Navigate to="/login" state={{ from: location }} />
                  )
                } 
              />
              <Route 
                path="/workspace/:id" 
                element={
                  user ? (
                    <Workspace />
                  ) : (
                    <Navigate to="/login" state={{ from: location }} />
                  )
                } 
              />
              <Route 
                path="/dostai" 
                element={
                  user ? (
                    <DostAIPage />
                  ) : (
                    <Navigate to="/login" state={{ from: location }} />
                  )
                } 
              />
              <Route 
                path="/create-test" 
                element={
                  user && user.role === "teacher" ? (
                    <CreateTest />
                  ) : (
                    <Navigate to="/login" state={{ from: location }} />
                  )
                } 
              />
              <Route 
                path="/test/:uniqueLink" 
                element={
                  user ? (
                    <TestWorkspace />
                  ) : (
                    <Navigate to="/login" state={{ from: location }} />
                  )
                } 
              />
            </Routes>
          </main>
        </div>
      </RoomProvider>
    </ErrorBoundary>
  );
};

export default App;