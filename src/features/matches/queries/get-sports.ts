import db from "@/database";
import { sports } from "@/database/schema";

export async function getSports() {
  return db.select().from(sports);
}