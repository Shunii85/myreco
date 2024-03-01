import { Record } from "../domain/record";
import { supabase } from "./supabase";

export const getAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase.from("study-record").select("*");
  if (error) {
    throw new Error(error.message);
  }

  const record = data.map((record) => {
    return new Record(record.id, record.title, record.time);
  });

  return record;
};
