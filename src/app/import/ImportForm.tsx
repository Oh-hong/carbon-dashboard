"use client";

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants";

// 카테고리 한글 → 영문 매핑
const CATEGORY_MAP: Record<string, string> = {
  "전기": "ELECTRICITY",
  "원소재": "RAW_MATERIAL",
  "운송": "TRANSPORT",
};

// Scope 매핑
const SCOPE_MAP: Record<string, number> = {
  "ELECTRICITY": 2,
  "RAW_MATERIAL": 3,
  "TRANSPORT": 3,
};

interface ParsedRow {
  date: string;
  category: string;
  categoryCode: string;
  name: string;
  amount: number;
  unit: string;
  scope: number;
  isValid: boolean;
  error?: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export function ImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  // 파일 파싱
  const parseFile = useCallback(async (selectedFile: File) => {
    setIsParsing(true);
    setResult(null);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const parsed: ParsedRow[] = jsonData.map((row, index) => {
        const errors: string[] = [];

        // 날짜 파싱
        let dateStr = "";
        const rawDate = row["일자(원본)"] || row["날짜"] || row["date"] || row["Date"];
        if (rawDate) {
          if (typeof rawDate === "number") {
            // Excel 날짜 시리얼 넘버
            const date = XLSX.SSF.parse_date_code(rawDate);
            dateStr = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
          } else {
            dateStr = String(rawDate);
          }
        } else {
          errors.push("날짜 없음");
        }

        // 카테고리 파싱
        const categoryRaw = String(row["활동 유형"] || row["카테고리"] || row["category"] || row["Category"] || "");
        const categoryCode = CATEGORY_MAP[categoryRaw] || "";
        if (!categoryCode) {
          errors.push(`카테고리 오류: "${categoryRaw}"`);
        }

        // 항목명
        const name = String(row["설명"] || row["항목명"] || row["name"] || row["Name"] || "");
        if (!name) {
          errors.push("항목명 없음");
        }

        // 사용량
        const amountRaw = row["량"] || row["사용량"] || row["amount"] || row["Amount"];
        const amount = Number(amountRaw);
        if (isNaN(amount) || amount <= 0) {
          errors.push("사용량 오류");
        }

        // 단위
        const unit = String(row["단위"] || row["unit"] || row["Unit"] || "");
        if (!unit) {
          errors.push("단위 없음");
        }

        return {
          date: dateStr,
          category: categoryRaw,
          categoryCode,
          name,
          amount: isNaN(amount) ? 0 : amount,
          unit,
          scope: SCOPE_MAP[categoryCode] || 0,
          isValid: errors.length === 0,
          error: errors.length > 0 ? errors.join(", ") : undefined,
        };
      });

      setParsedData(parsed);
    } catch (error) {
      console.error("Parse error:", error);
      setParsedData([]);
    } finally {
      setIsParsing(false);
    }
  }, []);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  // 드래그 앤 드롭
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) {
      setFile(droppedFile);
      parseFile(droppedFile);
    }
  }, [parseFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 임포트 실행
  const handleImport = async () => {
    const validData = parsedData.filter((row) => row.isValid);
    if (validData.length === 0) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities: validData }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          imported: data.imported,
          errors: [],
        });
        // 성공 시 폼 초기화
        setFile(null);
        setParsedData([]);
      } else {
        setResult({
          success: false,
          imported: 0,
          errors: [data.error || "임포트에 실패했습니다."],
        });
      }
    } catch {
      setResult({
        success: false,
        imported: 0,
        errors: ["서버 오류가 발생했습니다."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validCount = parsedData.filter((r) => r.isValid).length;
  const invalidCount = parsedData.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            {isParsing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="text-sm text-gray-600">파일 분석 중...</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-2">
                <FileSpreadsheet className="h-10 w-10 text-emerald-500" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">다른 파일을 선택하려면 클릭하세요</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Excel 파일을 드래그하거나 클릭하여 선택
                </p>
                <p className="text-xs text-gray-400">.xlsx, .xls 지원</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 결과 메시지 */}
      {result && (
        <Card className={result.success ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm text-emerald-800">
                    <strong>{result.imported}건</strong>의 데이터가 성공적으로 임포트되었습니다.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-800">{result.errors.join(", ")}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 미리보기 테이블 */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">미리보기</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  유효: {validCount}건
                </Badge>
                {invalidCount > 0 && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    오류: {invalidCount}건
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>항목명</TableHead>
                    <TableHead className="text-right">사용량</TableHead>
                    <TableHead>단위</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row, index) => (
                    <TableRow key={index} className={!row.isValid ? "bg-red-50" : ""}>
                      <TableCell className="text-gray-500">{index + 1}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {row.categoryCode ? (
                          <Badge variant="secondary">
                            {CATEGORY_LABELS[row.categoryCode] || row.category}
                          </Badge>
                        ) : (
                          row.category
                        )}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="text-right">{row.amount.toLocaleString()}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <Badge className="bg-emerald-100 text-emerald-800">OK</Badge>
                        ) : (
                          <span className="text-xs text-red-600">{row.error}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 임포트 버튼 */}
      {validCount > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleImport}
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                임포트 중...
              </>
            ) : (
              <>임포트 ({validCount}건)</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
