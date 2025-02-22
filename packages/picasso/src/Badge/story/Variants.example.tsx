import React from 'react'
import { Container, Typography, Badge } from '@toptal/picasso'

const Example = () => (
  <>
    <Container>
      <Typography variant='heading' size='small'>
        White:
      </Typography>
    </Container>
    <Container top='small'>
      <Badge content={1} variant='white' />
    </Container>

    <Container top='medium'>
      <Typography variant='heading' size='small'>
        Red:
      </Typography>
    </Container>
    <Container top='small'>
      <Badge content={100} variant='red' />
    </Container>
  </>
)

export default Example
