import React from 'react'
import styles from './index.module.scss'
import cx from 'classnames'

export const NotifyContent: React.FC<{
  onOpenLink?: () => void
}> = ({ onOpenLink }) => {
  return (
    <div className={styles.notify}>
      <div className={cx(styles.item, styles.title)}>OPQBOT Global Notify</div>
      <div className={styles.item}>最新版本解决了图片问题，建议您</div>
      <div className={styles.item}>
        立即
        <a
          href="https://github.com/opq-osc/OPQ/releases"
          target="_blank"
          title="new version"
          rel="noreferrer"
          className={styles.link}
          onClick={(e) => {
            onOpenLink?.()
          }}
        >
          更新最新版本 v6.7
        </a>
        获取更好的体验
      </div>
    </div>
  )
}
