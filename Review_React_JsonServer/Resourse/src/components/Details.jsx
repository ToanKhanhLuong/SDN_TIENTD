import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCourses, getAllEnrollments, getAllStudents } from "../services/dataServices";

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [enroll, setEnrollment] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const studentData = await getAllStudents();
            const eData = await getAllEnrollments();
            const courseData = await getAllCourses();

            setStudents(studentData);
            setEnrollment(eData);
            setCourses(courseData);
        };
        fetchData();
    }, []);

    const studentId = Number(id);
    const student = students.find((s) => s.id === studentId);
    const studentEnrollments = enroll.filter((e) => e.studentId === studentId);
    const studentCourses = studentEnrollments
        .map((e) => courses.find((c) => c.id === e.courseId))
        .filter(Boolean);

    return (
        <div className="page-container">
            <section className="hero-card">
                <p className="eyebrow">Student profile</p>
                <h1 className="page-title">{student?.name || "Student details"}</h1>
                <p className="page-subtitle">{student?.email || "Loading student information..."}</p>
                <div className="stat-grid">
                    <div className="stat-card">
                        <strong>{studentCourses.length}</strong>
                        <span>Registered courses</span>
                    </div>
                </div>
            </section>

            <section className="content-card">
                <div className="section-heading">
                    <h3>Course list</h3>
                    <Button className="btn-modern btn-soft" onClick={() => navigate("/")}>Back to home</Button>
                </div>

                {studentCourses.length === 0 ? (
                    <div className="empty-state">This student has not registered for any courses yet.</div>
                ) : (
                    <Table responsive hover className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentCourses.map((course) => (
                                <tr key={course.id}>
                                    <td>#{course.id}</td>
                                    <td className="item-title">{course.title}</td>
                                    <td className="item-muted">{course.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </section>
        </div>
    );
};

export default Details