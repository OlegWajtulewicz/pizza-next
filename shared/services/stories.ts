import { Story, StoryItem } from '@prisma/client';
import { axiosInstance } from './instance';

export type IStory = Story & {
  items: StoryItem[];
};

export const getAll = async () => {
  const { data } = await axiosInstance.get<IStory[]>('/stories');
  return data;
};

export const getStoryById = async (id: number) => {
  const { data } = await axiosInstance.get<IStory>(`/stories?id=${id}`);
  return data;
};

export type CreateStoryPayload = {
  previewImageUrl: string;
  items: { sourceUrl: string }[];
};

export const createStory = async (payload: CreateStoryPayload) => {
  const { data } = await axiosInstance.post<IStory>('/stories', payload);
  return data;
};

export const deleteStory = async (id: number) => {
  const { data } = await axiosInstance.delete(`/stories?id=${id}`);
  return data;
};

//* GET /api/stories – Возвращает все истории.
//* GET /api/stories?id=1 – Возвращает историю с ID 1.
//* POST /api/stories – Создает новую историю:



