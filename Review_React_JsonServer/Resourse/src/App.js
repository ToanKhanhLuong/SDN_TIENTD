import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateCourses from "./components/CreateCourses";
import CreateStudent from "./components/CreateStudent";
import Details from "./components/Details";
import Home from "./components/Home";
import RegisterCourses from "./components/RegisterCourses";

function App() {
    return (
        <BrowserRouter>
            <main className="app-shell">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/student/:id" element={<Details />} />
                    <Route path="/AddNewStudents" element={<CreateStudent />} />
                    <Route path="/AddNewCourses" element={<CreateCourses />} />
                    <Route path="/register-course" element={<RegisterCourses />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
