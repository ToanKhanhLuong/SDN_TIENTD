import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
    deleteCourse,
    deleteEnrollment,
    deleteStudent,
    getAllCourses,
    getAllEnrollments,
    getAllStudents
} from "../services/dataServices";

const Home = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const studentData = await getAllStudents();
            const courseData = await getAllCourses();
            const enrollmentData = await getAllEnrollments();
            setStudents(studentData);
            setCourses(courseData);
            setEnrollments(enrollmentData);
        };

        fetchData();
    }, []);

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm("Delete this student and related enrollments?")) {
            const relatedEnrollments = enrollments.filter((e) => e.studentId === studentId);

            for (const e of relatedEnrollments) {
                await deleteEnrollment(e.id);
            }

            await deleteStudent(studentId);
            setStudents(students.filter((s) => s.id !== studentId));
            setEnrollments(enrollments.filter((e) => e.studentId !== studentId));
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm("Delete this course and related enrollments?")) {
            const relatedEnrollments = enrollments.filter((e) => e.courseId === courseId);

            for (const e of relatedEnrollments) {
                await deleteEnrollment(e.id);
            }

            await deleteCourse(courseId);
            setCourses(courses.filter((c) => c.id !== courseId));
            setEnrollments(enrollments.filter((e) => e.courseId !== courseId));
        }
    };

    return (
        <div className="page-container">
            <section className="hero-card">
                <p className="eyebrow">Learning Management</p>
                <h1 className="page-title">Student & Course Dashboard</h1>
                <p className="page-subtitle">
                    Manage students, courses, and registrations in a clean modern interface designed for quick actions and better readability.
                </p>

                <div className="stat-grid">
                    <div className="stat-card">
                        <strong>{students.length}</strong>
                        <span>Total students</span>
                    </div>
                    <div className="stat-card">
                        <strong>{courses.length}</strong>
                        <span>Available courses</span>
                    </div>
                    <div className="stat-card">
                        <strong>{enrollments.length}</strong>
                        <span>Registrations</span>
                    </div>
                </div>
            </section>

            <div className="action-bar">
                <Button className="btn-modern" onClick={() => navigate("/AddNewStudents")}>Add new student</Button>
                <Button className="btn-modern btn-soft" onClick={() => navigate("/AddNewCourses")}>Add new course</Button>
                <Button className="btn-modern" variant="success" onClick={() => navigate("/register-course")}>Register course</Button>
            </div>

            <Row className="g-4">
                <Col lg={6}>
                    <section className="content-card">
                        <div className="section-heading">
                            <h3>Students</h3>
                            <span className="badge-count">{students.length} records</span>
                        </div>
                        <Table responsive hover className="modern-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s.id}>
                                        <td>
                                            <span className="avatar">{s.name?.charAt(0)}</span>
                                            <span className="item-title">{s.name}</span>
                                        </td>
                                        <td className="item-muted">{s.email}</td>
                                        <td>
                                            <Button size="sm" className="btn-modern btn-soft me-2" onClick={() => navigate(`/student/${s.id}`)}>Details</Button>
                                            <Button size="sm" className="btn-modern" variant="danger" onClick={() => handleDeleteStudent(s.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </section>
                </Col>

                <Col lg={6}>
                    <section className="content-card">
                        <div className="section-heading">
                            <h3>Courses</h3>
                            <span className="badge-count">{courses.length} records</span>
                        </div>
                        <Table responsive hover className="modern-table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((c) => (
                                    <tr key={c.id}>
                                        <td className="item-title">{c.title}</td>
                                        <td className="item-muted">{c.description}</td>
                                        <td>
                                            <Button size="sm" className="btn-modern" variant="danger" onClick={() => handleDeleteCourse(c.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </section>
                </Col>
            </Row>
        </div>
    );
};

export default Home;