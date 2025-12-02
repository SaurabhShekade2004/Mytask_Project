import axiosClient from "./axiosClient";

export const getTasks = () => axiosClient.get("/tasks/all");


export const createTask = (payload) => axiosClient.post("/tasks/create", payload);

export const updateTask = (id, payload) =>
  axiosClient.put(`/tasks/update/${id}`, payload);


export const deleteTask = (id) => axiosClient.delete(`/tasks/delete/${id}`);


export const searchTasks = (query) =>
  axiosClient.get(`/tasks/search?title=${query}`);

export const filterTasks = (type) =>
  axiosClient.get(`/tasks/filter/${type}`);
