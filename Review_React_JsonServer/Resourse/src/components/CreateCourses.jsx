import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addCourse } from "../services/dataServices";

const CreateCourses = () => {
    const navigate = useNavigate();
    const [course, setCourse] = useState({ title: "", description: "" });

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addCourse(course);
        alert("Add course successfully!");
        navigate("/");
    };

    return (
        <div className="form-card">
            <p className="eyebrow">New course</p>
            <h1 className="page-title">Create course</h1>
            <p className="page-subtitle mb-4">Publish a course with a clear title and description.</p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Course title</Form.Label>
                    <Form.Control type="text" name="title" value={course.title} onChange={handleChange} placeholder="React for Beginners" required />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Course description</Form.Label>
                    <Form.Control as="textarea" rows={4} name="description" value={course.description} onChange={handleChange} placeholder="Write a short course description" required />
                </Form.Group>

                <div className="d-flex gap-2 flex-wrap">
                    <Button type="submit" className="btn-modern">Add course</Button>
                    <Button type="button" className="btn-modern btn-soft" onClick={() => navigate("/")}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateCourses