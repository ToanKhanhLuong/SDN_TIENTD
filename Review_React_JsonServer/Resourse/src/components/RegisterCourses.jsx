import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addEnrollment, getAllCourses, getAllStudents } from "../services/dataServices";

const RegisterCourses = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const studentData = await getAllStudents();
            const courseData = await getAllCourses();
            setStudents(studentData);
            setCourses(courseData);
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addEnrollment({ studentId: Number(studentId), courseId: Number(courseId) });
        alert("Register course successfully!");
        navigate("/");
    };

    return (
        <div className="form-card">
            <p className="eyebrow">Course registration</p>
            <h1 className="page-title">Register course</h1>
            <p className="page-subtitle mb-4">Connect a student with the right course in just a few clicks.</p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Choose student</Form.Label>
                    <Form.Select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                        <option value="">Select student</option>
                        {students.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} - {s.email}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Choose course</Form.Label>
                    <Form.Select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
                        <option value="">Select course</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2 flex-wrap">
                    <Button type="submit" className="btn-modern">Register</Button>
                    <Button type="button" className="btn-modern btn-soft" onClick={() => navigate("/")}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
};

export default RegisterCourses;