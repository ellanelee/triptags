interface SyncCallback {
  onVenueUpdate: (data: { name: string; googlePlaceId: string }) => void
  onDetailUpdate: (data: {
    phoneNumber?: string
    websiteUrl?: string
    workHour?: any
  }) => void
}

export function syncGoogleVenueDetails(
  placeId: string,
  callbacks: SyncCallback,
) {
  if (!placeId) return

  const service = new google.maps.places.PlacesService(
    document.createElement("div"), //placeService가 HTML요소를 참조하여 작동함
  )
  service.getDetails(
    //설정 객체(placeId와 원하는 field)
    {
      placeId: placeId,
      fields: ["name", "formatted_phone_number", "website", "opening_hours"],
    },
    (place, status) => {
      //place는 response 객체, status 상태
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        console.log("API Response: ", { place, status })
        callbacks.onVenueUpdate({
          name: place.name || "",
          googlePlaceId: placeId,
        })
        callbacks.onDetailUpdate({
          phoneNumber: place.formatted_phone_number || "",
          websiteUrl: place.website || "",
          workHour: place.opening_hours || {},
        })
      }
    },
  )
}
