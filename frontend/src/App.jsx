import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Pages
import LandingPage from "./pages/LandingPage";
import ViewPostPage from "./pages/ViewPostPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleManagementPage from "./pages/admin/ArticleManagementPage";
import CreateArticlePage from "./pages/admin/CreateArticlePage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import CreateCategoryPage from "./pages/admin/CreateCategoryPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminNotificationPage from "./pages/admin/AdminNotificationPage";
import AdminResetPasswordPage from "./pages/admin/AdminResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route
              index
              element={<Navigate to="article-management" replace />}
            />
            <Route
              path="article-management"
              element={<ArticleManagementPage />}
            />
            <Route
              path="article-management/create"
              element={<CreateArticlePage />}
            />
            <Route
              path="article-management/edit/:articleId"
              element={<CreateArticlePage />}
            />
            <Route
              path="category-management"
              element={<CategoryManagementPage />}
            />
            <Route
              path="category-management/create"
              element={<CreateCategoryPage />}
            />
            <Route
              path="category-management/edit/:categoryId"
              element={<CreateCategoryPage />}
            />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="notification" element={<AdminNotificationPage />} />
            <Route path="reset-password" element={<AdminResetPasswordPage />} />
          </Route>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/success" element={<SignupSuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/profile/reset-password"
            element={<ResetPasswordPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
