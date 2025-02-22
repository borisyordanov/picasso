import { ZoomBehavior, ZoomedElementBaseType } from 'd3-zoom'
import { RefObject, useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'

export interface UseZoomArguments<
  ZoomRefElement extends ZoomedElementBaseType
> {
  rootRef: RefObject<ZoomRefElement>
  scaleExtent: [number, number]
  center?: { x: number; y: number }
  initialScale?: number
  transitionDuration: number
}

export interface UseZoomResponse<ZoomRefElement extends ZoomedElementBaseType> {
  zoom: ZoomBehavior<ZoomRefElement, unknown>
  handleZoom: (step: number) => void
}

export const useZoom = <ZoomRefElement extends ZoomedElementBaseType>({
  rootRef,
  scaleExtent,
  center,
  initialScale = 1,
  transitionDuration
}: UseZoomArguments<ZoomRefElement>): UseZoomResponse<ZoomRefElement> => {
  const [initialized, setInitialized] = useState(false)
  const zoom = useMemo(
    () => d3.zoom<ZoomRefElement, unknown>().scaleExtent(scaleExtent),
    [scaleExtent]
  )

  const handleZoom = (step: number) => {
    if (!rootRef.current) {
      return
    }

    d3.select(rootRef.current).transition().call(zoom.scaleBy, step)
  }

  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    const transformContainer = d3.select(rootRef.current.firstElementChild)

    zoom.on('zoom', (event: any) => {
      transformContainer.attr('transform', event.transform)
    })

    if (!initialized) {
      d3.select(rootRef.current)
        .call(zoom)
        .call(zoom.transform, d3.zoomIdentity.scale(initialScale))

      if (center) {
        d3.select(rootRef.current).call(zoom.translateTo, center.x, center.y)
      }

      setInitialized(true)
    } else if (center) {
      d3.select(rootRef.current)
        .transition()
        .duration(transitionDuration)
        .call(zoom.translateTo, center.x, center.y)
    }
  }, [zoom, initialized, center, rootRef, initialScale, transitionDuration])

  return {
    zoom,
    handleZoom
  }
}
