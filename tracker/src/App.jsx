// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/EmpDashboard";
import TaskManagerDashboard from "./pages/TaskmanagerDash";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import DailyLog from "./pages/DailyLog";
import Productivity from "./pages/Productivity";
import Notifications from "./pages/Notification";
import ProductivityReport from "./pages/ProductivityReport";
import ApplyLeave from "./pages/ApplyLeave";
import PremiumFeatures from "./pages/Premiumfeatures";
import Pricing from "./pages/Pricing";
import AdminUsers from "./pages/Adminuser";
import AdminTasks from "./pages/Admintask";
import Attendance from "./pages/Attendance";
import TimeTracker from "./pages/TimeTracker";
import PremiumDashboard from "./pages/PremiumDash";
import Profile from "./pages/Profile";
import ManagerTaskList from "./pages/Mangertask";
import ManagerAddTask from "./pages/Mangeraddtask";
import ManagerLeaves from "./pages/managerleave";
import ManagerRecords from "./pages/managerrecord";
import AdminReports from "./pages/AdminReports";
import AdminRolePermissions from "./pages/AdminPermission";
import AdminDisputes from "./pages/AdminDispute";
import CreateDispute from "./pages/CreateDispute";
import Approval from "./pages/Approval";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProjectsPage from "./pages/ProjectsPage";
import TeamsPage from "./pages/TeamsPage";
import AllReminders from "./pages/AllReminders";
import ManagerChat from "./pages/Mangerchat";
import EditProfile from "./pages/EditProfile";
import Success from "./pages/Success";
import Chats from "./pages/Chats";
import CreateReminder from "./pages/CreateReminder";
import UserStatusAdmin from "./pages/UserStatusAdmin"
import AdminEditDispute from "./pages/AdminEditDispute";
function App() {
  return (
    <Router>
      <Routes>
        {/* Stripe success/cancel routes should be top-level */}
        <Route path="/paymentsuccess" element={<Success />} />

        <Route
          path="/pricing"
          element={
            <PrivateRoute roles={["user"]}>
              <Pricing />
            </PrivateRoute>
          }
        />

        {/* All other routes under Layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Employee Routes */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="dailylog"
            element={
              <PrivateRoute roles={["user"]}>
                <DailyLog />
              </PrivateRoute>
            }
          />
          <Route
            path="productivity"
            element={
              <PrivateRoute roles={["user"]}>
                <Productivity />
              </PrivateRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <PrivateRoute roles={["user"]}>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="productivityreport"
            element={
              <PrivateRoute roles={["user"]}>
                <ProductivityReport />
              </PrivateRoute>
            }
          />
          <Route
            path="apply-leave"
            element={
              <PrivateRoute roles={["user"]}>
                <ApplyLeave />
              </PrivateRoute>
            }
          />
          <Route
            path="premium"
            element={
              <PrivateRoute roles={["user"]}>
                <PremiumFeatures />
              </PrivateRoute>
            }
          />
          <Route
            path="premiumdashboard"
            element={
              <PrivateRoute roles={["user"]}>
                <PremiumDashboard />
              </PrivateRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="taskmanager"
            element={
              <PrivateRoute roles={["manager"]}>
                <TaskManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route path="manager/tasks" element={<ManagerTaskList />} />
          <Route path="manager/add-task" element={<ManagerAddTask />} />
          <Route path="manager/leaves" element={<ManagerLeaves />} />
          <Route path="manager/projects" element={<ProjectsPage />} />
          <Route path="manager/teams" element={<TeamsPage />} />
          <Route path="manager/records" element={<ManagerRecords />} />
          <Route path="manager/chat" element={<ManagerChat />} />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/tasks" element={<AdminTasks />} />
          <Route path="admin/reports" element={<AdminReports />} />
          <Route path="admin/roles" element={<AdminRolePermissions />} />
          <Route path="admin/disputes" element={<AdminDisputes />} />
          <Route path="admin/approval" element={<Approval />} />
          <Route path="admin/user-status" element={<UserStatusAdmin />} />
<Route
  path="/admin/disputes/edit/:id"
  element={<AdminEditDispute />}
/>

          {/* Other Routes */}
          <Route path="leave" element={<ApplyLeave />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="time" element={<TimeTracker />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="disputes/create" element={<CreateDispute />} />
          <Route path="chat" element={<Chats />} />
          <Route path="createreminder" element={<CreateReminder />} />
          <Route path="/all-reminders" element={<AllReminders />} />


        </Route>
      </Routes>
    </Router>
  );
}

export default App;
