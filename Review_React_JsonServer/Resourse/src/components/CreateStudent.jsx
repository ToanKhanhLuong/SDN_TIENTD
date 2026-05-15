import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../services/dataServices";

const CreateStudent = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: "", email: "" });

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addStudent(student);
        alert("Add student successfully!");
        navigate("/");
    };

    return (
        <div className="form-card">
            <p className="eyebrow">New student</p>
            <h1 className="page-title">Create profile</h1>
            <p className="page-subtitle mb-4">Add student information to the management system.</p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control type="text" name="name" value={student.name} onChange={handleChange} placeholder="Enter full name" required />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" value={student.email} onChange={handleChange} placeholder="student@example.com" required />
                </Form.Group>

                <div className="d-flex gap-2 flex-wrap">
                    <Button type="submit" className="btn-modern">Add student</Button>
                    <Button type="button" className="btn-modern btn-soft" onClick={() => navigate("/")}>Cancel</Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateStudent;