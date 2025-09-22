import { useState } from "react"
import AppLayout from "@/layouts/app-layout"
import { Head, useForm, router } from "@inertiajs/react"

type KycForm = {
  national_id?: File
  utility_bill?: File
}

export default function KycUploadPage({ documents }: { documents: any[] }) {
  const { post, progress, errors } = useForm<KycForm>({})
  const [files, setFiles] = useState<{ [key: string]: File | null }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    if (files["national_id"]) formData.append("national_id", files["national_id"])
    if (files["utility_bill"]) formData.append("utility_bill", files["utility_bill"])

    router.post("/kyc/upload", formData)
  }

  const getDoc = (type: string) => documents.find((d) => d.document_type === type)

  return (
    <AppLayout>
      <Head title="KYC Upload" />
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <h2 className="text-2xl font-bold text-gray-800">Upload / View KYC Documents</h2>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-md rounded-lg p-6">
          
          {/* National ID */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">National ID / Passport</label>
            <input
              type="file"
              disabled={getDoc("national_id")?.status === "approved"}
              onChange={(e) =>
                setFiles({ ...files, national_id: e.target.files?.[0] ?? null })
              }
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.national_id && (
              <p className="text-red-500 text-sm">{errors.national_id}</p>
            )}

            {getDoc("national_id") && (
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                <p className="text-sm">
                  📄 Submitted:{" "}
                  <a
                    href={`/storage/${getDoc("national_id").file_path}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {getDoc("national_id").original_filename}
                  </a>{" "}
                  — <span className="font-semibold">{getDoc("national_id").status}</span>
                  {getDoc("national_id").rejection_reason && (
                    <span className="text-red-600">
                      {" "}
                      (Reason: {getDoc("national_id").rejection_reason})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Utility Bill */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Proof of Address (Utility Bill)</label>
            <input
              type="file"
              disabled={getDoc("utility_bill")?.status === "approved"}
              onChange={(e) =>
                setFiles({ ...files, utility_bill: e.target.files?.[0] ?? null })
              }
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.utility_bill && (
              <p className="text-red-500 text-sm">{errors.utility_bill}</p>
            )}

            {getDoc("utility_bill") && (
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                <p className="text-sm">
                  📄 Submitted:{" "}
                  <a
                    href={`/storage/${getDoc("utility_bill").file_path}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {getDoc("utility_bill").original_filename}
                  </a>{" "}
                  — <span className="font-semibold">{getDoc("utility_bill").status}</span>
                  {getDoc("utility_bill").rejection_reason && (
                    <span className="text-red-600">
                      {" "}
                      (Reason: {getDoc("utility_bill").rejection_reason})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              progress
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={!!progress}
          >
            {progress ? `Uploading... ${progress.percentage}%` : "Submit"}
          </button>

          {/* Optional Progress Bar */}
          {progress && (
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  )
}
