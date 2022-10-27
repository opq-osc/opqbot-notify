import React from 'react'
import styles from './index.module.scss'
import cx from 'classnames'
import { useCopyToClipboard } from 'react-use'
import CopySvg from './copy.svg'
import QrSvg from './qr.svg'

const GROUP = `1`
const QR_CODE_URL = `1`

export const NotifyContent: React.FC<{
  onOpenLink?: () => void
}> = ({ onOpenLink }) => {
  const [_, copy] = useCopyToClipboard()

  return (
    <div className={styles.notify}>
      <div className={styles.group_line}>
        <div className={styles.group_first}>
          交流群：<strong>{GROUP}</strong>
        </div>
        <div
          onClick={() => {
            copy(GROUP)
            onOpenLink?.()
          }}
          style={{ marginLeft: 3 }}
          className={styles.copy_icon}
        >
          <CopySvg />
        </div>
        <div
          onClick={() => {
            setTimeout(() => {
              window.open(QR_CODE_URL, '_blank', 'noopener,noreferrer')
              onOpenLink?.()
            }, 500)
          }}
          style={{ marginLeft: -5 }}
          className={styles.copy_icon}
        >
          <QrSvg />
        </div>
      </div>
    </div>
  )
}
