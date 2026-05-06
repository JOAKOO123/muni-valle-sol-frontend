'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Reporte } from '@/types/Reporte'
import useUserLocation from '@/hooks/useUserLocation'

// Fix default icon paths for Leaflet when used with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const iconoIncendio = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const iconoUsuario = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface CentrarMapaProps {
  ubicacion: { lat: number; lng: number } | null
}

const CentrarMapa = ({ ubicacion }: CentrarMapaProps) => {
  const map = useMap()
  useEffect(() => {
    if (ubicacion) {
      map.setView([ubicacion.lat, ubicacion.lng], 13)
    }
  }, [ubicacion, map])
  return null
}

interface MapaIncendiosProps {
  reportes: Reporte[]
}

const MapaIncendios = ({ reportes }: MapaIncendiosProps) => {
  const { userLocation } = useUserLocation()

  const centro: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-33.4569, -70.6483]

  return (
    <MapContainer
      center={centro}
      zoom={13}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={iconoUsuario}>
          <Popup>Tu ubicacion actual</Popup>
        </Marker>
      )}

      {reportes.map((reporte) =>
        reporte.ubicacion ? (
          <Marker
            key={reporte.id}
            position={[reporte.ubicacion.lat, reporte.ubicacion.lng]}
            icon={iconoIncendio}
          >
            <Popup>
              <strong>{reporte.titulo}</strong>
              <br />
              Estado: {reporte.estado}
              <br />
              {reporte.ubicacion.direccion}
            </Popup>
          </Marker>
        ) : null
      )}

      <CentrarMapa ubicacion={userLocation} />
    </MapContainer>
  )
}

export default MapaIncendios
