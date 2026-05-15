import api from "./api";

export const getAllStudents = async () =>{
    const response = await api.get("/students");
    return response.data;
};

export const getAllCourses = async () =>{
    const response = await api.get("/courses");
    return response.data;
}; 

export const getAllEnrollments = async () =>{
    const response = await api.get("/enrollments");
    return response.data;
}; 

export const addStudent = async (student) => {
    const response = await api.post("/students", student);
    return response.data;
};

export const addCourse = async (course) => {
    const response = await api.post("/courses", course);
    return response.data;
};



export const addEnrollment = async (enrollment) => {
    const response = await api.post("/enrollments", enrollment);
    return response.data;
};

export const deleteStudent = async (id) => {
    await api.delete(`/students/${id}`);
};

export const deleteCourse = async (id) => {
    await api.delete(`/courses/${id}`);
};

export const deleteEnrollment = async (id) => {
    await api.delete(`/enrollments/${id}`);
};