import { Container, Typography } from '@toptal/picasso'
import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  cloneElement
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Search16 as Search } from '@toptal/picasso/Icon'

import styles from './styles'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Adds <Icon /> before EmptyStateCollection content */
  icon?: ReactElement
}

const useStyles = makeStyles<Theme>(styles, {
  name: 'PicassoEmptyStateCollection'
})

export const EmptyStateCollection = forwardRef<HTMLDivElement, Props>(
  function EmptyStateCollection(props, ref) {
    const classes = useStyles()
    const { icon, children, style, ...rest } = props
    const iconProps = {
      className: classes.icon,
      color: 'dark-grey' as const
    }
    const iconElement = icon ? (
      cloneElement(icon, iconProps)
    ) : (
      <Search {...iconProps} />
    )

    return (
      <Container {...rest} alignItems='center' flex ref={ref} style={style}>
        <Container
          alignItems='center'
          className={classes.iconWrapper}
          flex
          right='xsmall'
        >
          {iconElement}
        </Container>
        <Container>
          <Typography size='xsmall'>{children}</Typography>
        </Container>
      </Container>
    )
  }
)

EmptyStateCollection.displayName = 'EmptyStateCollection'

export default EmptyStateCollection
