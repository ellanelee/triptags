"use client"
import { localApi } from "@/lib/api/local.api"
import { useAsync } from "@/lib/hooks/use.async"
import { getCurrentPosition } from "@/lib/utils/geolocation"
import { ILocalVerificationProps } from "@/types/interfaces/interface.props"
import { VerificationMethod } from "@triptags/shared"

export default function LocalVerification({
  venueId,
  isVerified,
  setIsVerified,
}: ILocalVerificationProps) {
  const localVerification = useAsync(null)

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
        setIsVerified(true)
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
            <h3 className="text-sm font-medium text-gray-700">위치 인증</h3>
            <p className="text-xs text-gray-500 mt-1">
              현재 위치를 인증하면 로컬 리뷰로 등록됩니다
            </p>
          </div>
          <div>
            {!isVerified && (
              <button
                type="button"
                onClick={handleLocation}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                인증하기
              </button>
            )}
          </div>
        </div>
        <div>
          {isVerified ? (
            <span className="text-sm text-green-600 font-medium">
              ✓ 위치 인증됨
            </span>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              인증된 위치가 장소와 15km 이내일 경우 로컬 리뷰입니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
