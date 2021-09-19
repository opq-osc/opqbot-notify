import React from 'react'
import styles from './index.module.scss'
import cx from 'classnames'

export const NotifyContent: React.FC<{
  onOpenLink?: () => void
}> = ({ onOpenLink }) => {
  return (
    <div className={styles.notify}>
      <div className={cx(styles.item, styles.title)}>OPQBOT Global Notify</div>
      <div className={styles.item}>由于协议变更，为了保护您的安全</div>
      <div className={styles.item}>
        建议您 <strong>立即停止</strong> 所有正在运行的实例
      </div>
      <div className={styles.item}>
        <a
          href="https://docs.opqbot.com/other/join.html"
          target="_blank"
          title="group info"
          rel="noreferrer"
          className={styles.link}
          onClick={(e) => {
            onOpenLink?.()
          }}
        >
          关注我们的群组
        </a>
        耐心等待更新升级
      </div>
    </div>
  )
}
