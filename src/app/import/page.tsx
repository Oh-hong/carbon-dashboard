import { Header } from "@/components/layout";
import { ImportForm } from "./ImportForm";

export default function ImportPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="데이터 임포트" />

      <div className="flex-1 p-6 space-y-6">
        {/* 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-blue-800 mb-2">
            Excel 파일로 활동 데이터 일괄 등록
          </h2>
          <p className="text-sm text-blue-700 mb-3">
            아래 형식의 Excel 파일(.xlsx, .xls)을 업로드하세요.
          </p>
          <div className="bg-white rounded border border-blue-200 p-3 overflow-x-auto">
            <table className="text-xs text-blue-800">
              <thead>
                <tr className="border-b border-blue-200">
                  <th className="px-3 py-1 text-left">일자(원본)</th>
                  <th className="px-3 py-1 text-left">활동 유형</th>
                  <th className="px-3 py-1 text-left">설명</th>
                  <th className="px-3 py-1 text-left">량</th>
                  <th className="px-3 py-1 text-left">단위</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1">2025-01-01</td>
                  <td className="px-3 py-1">전기</td>
                  <td className="px-3 py-1">한국전력</td>
                  <td className="px-3 py-1">110</td>
                  <td className="px-3 py-1">kWh</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">2025-01-01</td>
                  <td className="px-3 py-1">원소재</td>
                  <td className="px-3 py-1">플라스틱 1</td>
                  <td className="px-3 py-1">230</td>
                  <td className="px-3 py-1">kg</td>
                </tr>
                <tr>
                  <td className="px-3 py-1">2025-01-01</td>
                  <td className="px-3 py-1">운송</td>
                  <td className="px-3 py-1">트럭</td>
                  <td className="px-3 py-1">41</td>
                  <td className="px-3 py-1">ton-km</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 임포트 폼 */}
        <ImportForm />
      </div>
    </div>
  );
}
