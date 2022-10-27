import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useLocalStorage } from 'react-use'
import dayjs from 'dayjs'

import { NotifyContent } from './NotifyContent'

// Agreement: version + 1 at each update
export const VERSION = 'v2'
export const UNIVERSAL_NOTIFY_KEY = `__opqbot-notify-${VERSION}`
export const NORMAL_DATE_FORMAT = 'YYYY-MM-DD'

export const isDev = process.env.NODE_ENV === 'development'

export const Notify: React.FC = () => {
  const [prevDate, setPrevDate] = useLocalStorage(
    UNIVERSAL_NOTIFY_KEY,
    dayjs('2000-01-01').format(NORMAL_DATE_FORMAT)
  )

  useEffect(() => {
    const currentDateIns = dayjs()
    const prevDateIns = dayjs(prevDate)

    const isNeedNotify = currentDateIns.isAfter(prevDateIns, 'day') || isDev
    if (!isNeedNotify) {
      return
    }

    toast(
      <NotifyContent
        onOpenLink={() => {
          setPrevDate(currentDateIns.format(NORMAL_DATE_FORMAT))
        }}
      />,
      {
        position: 'top-right',
        autoClose:
          process.env.NODE_ENV === 'development' ? 1000 * 1e3 : 10 * 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    )
  }, [])

  return (
    <div>
      <ToastContainer />
    </div>
  )
}
