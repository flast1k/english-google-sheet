const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })

export const retryWithDelay = async <T>({
  fn,
  retries = 5,
  onError,
  finalErr = null,
  interval = 5000,
}: {
  fn: () => Promise<T>
  retries?: number
  interval?: number
  finalErr?: unknown
  onError?: (err: unknown) => void
}): Promise<T> => {
  try {
    // try
    return await fn()
  } catch (err) {
    onError?.(err)
    // if no retries left
    // throw error
    if (retries <= 0) {
      return Promise.reject(finalErr)
    }

    //delay the next call
    await wait(interval)

    //recursively call the same func
    return retryWithDelay({
      fn,
      retries: retries - 1,
      interval,
      finalErr,
      onError,
    })
  }
}
