import React, { useState } from 'react'
import { Transitions } from '@toptal/picasso/utils'
import { Button, Container } from '@toptal/picasso'
import { ArrowDownMinor24 } from '@toptal/picasso/Icon'

const Example = () => {
  const [isRotated, setIsRotated] = useState(false)

  return (
    <>
      <Button onClick={() => setIsRotated(!isRotated)}>Rotate</Button>

      <Container top='medium'>
        <Transitions.Rotate180 on={isRotated}>
          <ArrowDownMinor24 />
        </Transitions.Rotate180>
      </Container>
    </>
  )
}

export default Example
