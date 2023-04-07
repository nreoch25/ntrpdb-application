import { Club } from "../../../lib/types";

export interface ClubArgs {
  id: string;
}

export interface ClubsArgs {
  limit: number;
  page: number;
}

export interface ClubsData {
  total: number;
  result: Club[];
}
