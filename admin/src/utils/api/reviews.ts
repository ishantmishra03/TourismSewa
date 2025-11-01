import api from "@/utils/axios";

export const getPendingReviews = async () => {
  const { data } = await api.get("/admin/reviews/pending");
  return data;
};

export const approveReview = async (id: string) => {
  const { data } = await api.patch(`/admin/reviews/${id}/approve`);
  return data;
};

export const rejectReview = async (id: string) => {
  const { data } = await api.delete(`/admin/reviews/${id}`);
  return data;
};
