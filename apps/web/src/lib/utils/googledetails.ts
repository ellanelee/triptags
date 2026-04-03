interface SyncCallback {
    onVenueUpdate: (data: {name: string}) => void
    onDetailUpdate: (data: {phoneNumber: string, websiteUrl: string}) => void 
}

export function syncGoogleVenueDetails(placeId: string, callbacks: SyncCallback ) {
  if (!placeId) return

  const service = new google.maps.places.PlacesService(
    document.createElement("div"),
  )
  service.getDetails(
    {
      placeId: placeId,
      fields: ["name", "formatted_phone_number", "website", "opening_hours"],
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        callbacks.onVenueUpdate({name: place.name || ""})
        callbacks.onDetailUpdate(({
          phoneNumber: place.formatted_phone_number || "",
          websiteUrl: place.website ||"",
        }))
      }
    },
  )
}
