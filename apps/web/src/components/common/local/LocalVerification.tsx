"use client"
import { localApi } from "@/lib/api/local.api"
import { useAsync } from "@/lib/hooks/use.async"
import { getCurrentPosition } from "@/lib/utils/geolocation"
import { ILocalVerificationProps } from "@/types/interfaces/interface.props"
import { ILocalVerification, VerificationMethod } from "@triptags/shared"
import { useTranslations } from "next-intl"

export default function LocalVerification({
  venueId,
  localVerificationId,
  setLocalVerificationId,
}: ILocalVerificationProps) {
  const tr = useTranslations("WriteReviewPage")
  const t = useTranslations("Common")
  const localVerification = useAsync<ILocalVerification>(null)

  //granted(허용), denied(거부), prompt(선택 안함)
  const handleLocation = async () => {
    try {
      alert("현재 위치를 기반으로 인증합니다. 위치권한을 허용해주세요.")

      const location = await getCurrentPosition()
      const localInfo = {
        verificationMethod: "GPS" as VerificationMethod,
        latitude: location.latitude,
        longitude: location.longitude,
      }
      const response = await localVerification.run(() =>
        localApi.getLocalVerification(venueId, localInfo),
      )
      if (response) {
        setLocalVerificationId(response.id)
        alert("위치가 인증되었습니다.")
      }
    } catch (e) {
      console.error(e)
      alert("위치 권한이 필요합니다")
    }
  }
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div>
        <div className="flex align-middle justify-between w-full">
          <div>
            <h3 className="text-lg font-medium text-gray-700">
              {tr("LocalVerification")}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {tr("LocalIndication")}
            </p>
          </div>
          <div>
            {!localVerificationId && (
              <button
                type="button"
                onClick={handleLocation}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tr("LocalVerification")}
              </button>
            )}
          </div>
        </div>
        <div>
          {localVerificationId ? (
            <span className="text-sm text-green-600 font-medium">
              {t("verified")}
            </span>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              {tr("verfiedCondition")}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
