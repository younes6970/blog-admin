import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns-jalali";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with comma separator (3 digits)
 * @param num - Number to format (string or number)
 * @returns Number formatted with comma separators
 */
export function formatThousandSeparator(num: number): string {
  const numValue = +num;

  if (isNaN(numValue)) return "0";

  return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const persianDate = (date?: Date | string) =>
  date ? format(new Date(date), "yyyy/MM/dd") : "";

export const persianTime = (date?: Date | string) =>
  date ? format(new Date(date), "HH:mm") : "";

export const persianDateTime = (date?: Date | string) =>
  date ? format(new Date(date), "yyyy/MM/dd - HH:mm") : "";

export const downloadExcel = (
  content: string | Blob,
  nameFile: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const isExcelFile = content instanceof Blob;
    const name = `${nameFile}-report.${isExcelFile ? "xlsx" : "csv"}`;
    try {
      if (
        !content ||
        (typeof content === "string" && !content.trim()) ||
        (content instanceof Blob && content.size === 0)
      ) {
        resolve(false);
        return;
      }

      // The API returns a complete XLSX file. Its binary bytes must be
      // downloaded unchanged; adding a CSV BOM would corrupt the workbook.
      const blob = isExcelFile
        ? content
        : new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), content], {
            type: "text/csv;charset=utf-8",
          });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();

      window.setTimeout(() => URL.revokeObjectURL(url), 0);

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

