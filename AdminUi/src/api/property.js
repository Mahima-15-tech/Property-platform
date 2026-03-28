import axios from "./axios";

// CREATE
export const createProperty = (data) => {
  return axios.post("/properties", data);
};

// GET ALL
export const getProperties = () => {
  return axios.get("/properties");
};

// GET SINGLE
export const getPropertyById = (id) => {
  return axios.get(`/properties/${id}`);
};

// UPDATE
export const updateProperty = (id, data) => {
  return axios.put(`/properties/${id}`, data);
};

// DELETE
export const deleteProperty = (id) => {
  return axios.delete(`/properties/${id}`);
};