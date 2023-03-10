import React from 'react'
import cls from 'classnames'
import { Link } from 'react-router-dom'

import stylesParent from '../DropdownListItemBase/component.module.scss'

import styles from './component.module.scss'

const DropdownListItemLink = ({
  icon,
  children,
  ...props
}: {
  icon?: React.ReactNode
  children?: React.ReactNode
} & Omit<React.ComponentProps<typeof Link>, 'className' | 'style'>) => {
  return (
    <Link
      {...props}
      className={cls(stylesParent.main, styles.main, icon && stylesParent.icon)}
    >
      {icon} {children}
    </Link>
  )
}

export { DropdownListItemLink }
