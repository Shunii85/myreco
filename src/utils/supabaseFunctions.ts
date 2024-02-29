import { Record } from "../MyRecord";
import { supabase } from "./supabase";

export const getAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase.from("study-record").select("*");
  if (error) {
    throw new Error(error.message);
  }

  return data;
};
