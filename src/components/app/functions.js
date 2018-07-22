const getIcon = function(name) {
  switch (name) {
    case 'GNO':
      return 'cc ' + 'GNO'
    case 'BCH':
      return 'cc ' + 'BCC'
    case 'AMP':
      return 'cc ' + 'AMP-alt'
    case 'BCN':
      return 'cc ' + 'BCN-alt'
    case 'BLK':
      return 'cc ' + 'BC-alt'
    case 'SBD':
      return 'cc ' + 'STEEM'
    case 'STR':
      return 'cc ' + 'STR-alt'
    case 'XCP':
      return 'cc ' + 'XCP-alt'
    case 'XEM':
      return 'cc ' + 'XEM-alt'
    case 'XPM':
      return 'cc ' + 'XPM-alt'
    case 'XRP':
      return 'cc ' + 'XRP-alt'
    case 'VTC':
      return 'cc ' + 'VTC-alt'
    case 'VRC':
      return 'cc ' + 'VRC-alt'
    case 'POT':
      return 'cc ' + 'POT-alt'
    case 'NXT':
      return 'cc ' + 'NXT-alt'
    case 'NMC':
      return 'cc ' + 'NMC-alt'
    case 'LTC':
      return 'cc ' + 'LTC-alt'
    case 'GRC':
      return 'cc ' + 'GRC-alt'
    case 'BTS':
      return 'cc ' + 'BTS-alt'
    case 'BTC':
      return 'cc ' + 'BTC-alt'
    case 'BTCD':
      return 'cc ' + 'BTCD-alt'
    case 'NOTE':
      return 'cc ' + 'NOTE-alt'
    case 'MAID':
      return 'cc ' + 'MAID-alt'
    case 'DOGE':
      return 'cc ' + 'DOGE-alt'
    case 'DASH':
      return 'cc ' + 'DASH-alt'

    default:
      return 'cc ' + name
  }
}

export { getIcon }
