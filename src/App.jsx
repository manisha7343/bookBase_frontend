import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import BookCatalogue from "./pages/BookCatalogue";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<BookCatalogue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;