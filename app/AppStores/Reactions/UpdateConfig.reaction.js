import { reaction } from 'mobx'

export default (appState) => {
  return reaction(
    () => appState.config,
    () => {
      appState.wallets.forEach((w) => {
        w.fetchingBalance(true)
      })
    }
  )
}
