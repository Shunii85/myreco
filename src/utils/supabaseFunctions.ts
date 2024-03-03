import { Record } from "../domain/record";
import { supabase } from "./supabase";

export const getAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase.from("study-record").select("*");
  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];
  const record = data.map((record) => {
    return new Record(record.id, record.title, record.time);
  });

  return record;
};

export const addRecords = async (
  title: string,
  time: number
): Promise<Record[]> => {
  const { data, error } = await supabase
    .from("study-record")
    .insert([{ title, time }])
    .select();
  if (error) {
    throw new Error(error.message);
  }

  const record = data.map((record) => {
    return new Record(record.id, record.title, record.time);
  });

  return record;
};

export const deleteRecord = async (id: string) => {
  const { error } = await supabase.from("study-record").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};
