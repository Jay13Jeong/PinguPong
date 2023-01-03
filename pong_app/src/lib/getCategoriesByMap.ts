import * as CatrgoryAPI from './api/category';
import { ICategoryTable } from '../types/categoryData';

export default async function getCategoriesByMap(): Promise<Map<number, string>> {
  const categoriesMap = new Map<number, string>();
  const categoriesRes = await CatrgoryAPI.getCategories();
  categoriesRes.data.data.forEach((e: ICategoryTable) => {
    categoriesMap.set(e.id, e.name || "");
  });
  return categoriesMap;
}