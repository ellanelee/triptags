export type Coordinates = {
  latitude: number
  longitude: number
}

export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) {
      rej(new Error("브라우저가 위치정보 미제공"))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        res({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            rej(new Error("위치에 대한 권한이 없습니다"))
            break
          case error.POSITION_UNAVAILABLE:
            rej(new Error("위치 정보를 사용할수 없습니다"))
            break
          case error.TIMEOUT:
            rej(new Error("위치 요청 시간이 초과되었습니다"))
          default:
            rej(new Error("위치 정보를 가져오지 못했습니다"))
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  })
}
